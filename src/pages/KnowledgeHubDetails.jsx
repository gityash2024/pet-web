import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { FaBook, FaCalendar, FaUserEdit, FaShareAlt, FaWhatsapp, FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getArticleById, getAllArticles } from '../contexts/api';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import profileImage from '../assets/profile.png';

const PageWrapper = styled.div`
  background-color: #f4f4f4;
  min-height: 100vh;
  padding: 40px 0;
`;

const ArticleHeader = styled.div`
  background-color: #0a6638;
  color: #fff;
  padding: 40px 0;
  margin-bottom: 30px;
  border-radius: 12px;
`;

const ArticleContent = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  padding: 30px;
  margin-bottom: 30px;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 20px 0;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #0a6638;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
`;

const AuthorCard = styled(Card)`
  background-color: #fffacc;
  border: none;
  border-radius: 12px;
  margin-bottom: 30px;
`;

const RelatedArticlesCard = styled(Card)`
  background-color: #fff;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const RelatedArticleItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 15px;
  }
`;

const ShareButton = styled(Button)`
  background-color: transparent;
  border: 1px solid #0a6638;
  color: #ffffff;
  transition: all 0.3s ease;
  margin: 5px;
  padding: 5px 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #0a6638;
    color: #fff;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const RelatedArticlesContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #0a6638;
    border-radius: 4px;
  }
`;

const KnowledgeHubDetails = () => {
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate(); // Add this line to use navigation

  useEffect(() => {
    fetchArticleDetails();
  }, [id]);

  const fetchArticleDetails = async () => {
    try {
      setLoading(true);
      const articleResponse = await getArticleById(id);
      const allArticlesResponse = await getAllArticles();

      if (!articleResponse.data || !articleResponse.data.article) {
        throw new Error('Article not found');
      }

      setArticle(articleResponse.data.article);

      const related = allArticlesResponse.data.articles
        .filter(
          (a) =>
            a.category === articleResponse.data.article.category &&
            a._id !== id
        )
        .slice(0, 3);

      setRelatedArticles(related);
    } catch (error) {
      toast.error('Failed to fetch article details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

// Modify the related articles section in the render method
const renderRelatedArticles = () => {
  return relatedArticles.length === 0 ? (
    <p className="text-center text-muted">
      No related articles found
    </p>
  ) : (
    relatedArticles.map((relatedArticle) => (
      <div
        key={relatedArticle._id}
        onClick={() => navigate(`/knowledge-hub-details/${relatedArticle._id}`)}
        style={{ cursor: 'pointer' }}
      >
        <RelatedArticleItem
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={relatedArticle.images?.[0] || profileImage}
            alt={relatedArticle.title}
          />
          <div>
            <h6 style={{ color: '#0a6638' }}>
              {relatedArticle.title}
            </h6>
            <small className="text-muted">
              {relatedArticle.category}
            </small>
          </div>
        </RelatedArticleItem>
      </div>
    ))
  );
};

  const shareArticle = (platform) => {
    const url = window.location.href;
    const text = `Check out this article: ${article.title}`;

    const platforms = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}`,
    };

    if (platforms[platform]) {
      window.open(platforms[platform], '_blank');
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner animation="border" variant="success" />
      </LoadingContainer>
    );
  }

  if (!article) {
    return (
      <PageWrapper>
        <Container>
          <div className="text-center py-5">
            <FaBook size={50} color="#0a6638" />
            <p className="mt-3">Article not found</p>
            <Link to="/knowledge-hub" className="btn btn-success mt-3">
              Back to Knowledge Hub
            </Link>
          </div>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <ArticleHeader>
          <Container>
            <Row>
              <Col>
                <h1>{article.title}</h1>
                <div className="d-flex align-items-center mt-3">
                  <div className="me-3 d-flex align-items-center">
                    <FaCalendar className="me-2" />
                    <span>
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="me-3 d-flex align-items-center">
                    <FaUserEdit className="me-2" />
                    <span>{article.author}</span>
                  </div>
                  <div className="position-relative">
                    <Button
                      variant="outline-light"
                      onClick={() => setShareOpen(!shareOpen)}
                    >
                      <FaShareAlt className="me-2" /> Share
                    </Button>
                    {shareOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          backgroundColor: '#fff',
                          borderRadius: '8px',
                          padding: '10px',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                          zIndex: 10,
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '10px',
                        }}
                      >
                        <ShareButton onClick={() => shareArticle('whatsapp')}>
                          <FaWhatsapp />
                        </ShareButton>
                        <ShareButton onClick={() => shareArticle('facebook')}>
                          <FaFacebookF />
                        </ShareButton>
                        <ShareButton onClick={() => shareArticle('linkedin')}>
                          <FaLinkedinIn />
                        </ShareButton>
                        <ShareButton onClick={() => shareArticle('twitter')}>
                          <FaTwitter />
                        </ShareButton>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </ArticleHeader>

        <Row>
          <Col md={9}>
            <ArticleContent>
              <img
                src={article.images?.[0] || profileImage}
                alt={article.title}
                className="img-fluid mb-4"
              />

              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(article.content),
                }}
              />
            </ArticleContent>

            <AuthorCard>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <img
                      src={profileImage}
                      alt={article.author}
                      className="img-fluid rounded-circle"
                    />
                  </Col>
                  <Col md={9}>
                    <h4 style={{ color: '#0a6638' }}>{article.author}</h4>
                    <p>
                      A passionate writer and expert in pet care, sharing
                      insights and knowledge to help pet owners provide the best
                      care for their companions.
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </AuthorCard>
          </Col>

          <Col md={3}>
            <RelatedArticlesCard>
              <Card.Header style={{ backgroundColor: '#0a6638', color: '#fff' }}>
                Related Articles
              </Card.Header>
              <Card.Body>
              <RelatedArticlesContainer>
      {renderRelatedArticles()}
    </RelatedArticlesContainer>
              </Card.Body>
            </RelatedArticlesCard>
          </Col>
        </Row>

        <div className="text-center mt-4">
          <Link to="/knowledge-hub">
            <Button variant="success" size="lg">
              Back to Knowledge Hub
            </Button>
          </Link>
        </div>
      </Container>
    </PageWrapper>
  );
};

export default KnowledgeHubDetails;