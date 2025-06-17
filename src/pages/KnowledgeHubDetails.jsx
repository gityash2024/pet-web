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
  background: linear-gradient(135deg, #f8f8f8 0%, var(--background-highlight) 100%);
  min-height: 100vh;
  padding: 40px 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(251, 194, 31, 0.15) 0%, transparent 70%),
                radial-gradient(circle at bottom left, rgba(192, 49, 21, 0.08) 0%, transparent 70%);
    z-index: 0;
    pointer-events: none;
  }
`;

const PageContent = styled.div`
  position: relative;
  z-index: 1;
`;

const ArticleHeader = styled.div`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #fff;
  padding: 40px 0;
  margin-bottom: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(251, 194, 31, 0.2) 0%, transparent 70%);
    pointer-events: none;
  }
  
  h1 {
    font-weight: 700;
    margin-bottom: 1.5rem;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

const ArticleContent = styled.div`
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid rgba(251, 194, 31, 0.2);

  img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 20px 0;
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--primary-dark);
    margin-top: 1.5em;
    margin-bottom: 0.8em;
    font-weight: 600;
  }
  
  p {
    line-height: 1.7;
    margin-bottom: 1.2em;
    color: var(--text-dark);
  }
  
  ul, ol {
    margin-bottom: 1.2em;
    padding-left: 1.5em;
  }
  
  a {
    color: var(--primary);
    text-decoration: none;
    
    &:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }
  }
  
  blockquote {
    border-left: 4px solid var(--primary);
    padding-left: 1rem;
    margin-left: 0;
    color: #555;
    font-style: italic;
  }
`;

const AuthorCard = styled(Card)`
  background: linear-gradient(135deg, rgba(251, 194, 31, 0.1) 0%, rgba(251, 201, 96, 0.2) 100%);
  border: none;
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  overflow: hidden;
  
  .card-body {
    padding: 25px;
  }
  
  img {
    width: 100%;
    max-width: 120px;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }
  
  h4 {
    color: var(--primary-dark);
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  p {
    color: var(--text-dark);
    line-height: 1.6;
  }
`;

const RelatedArticlesCard = styled(Card)`
  background: #ffffff;
  border: none;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  overflow: hidden;
  border: 1px solid rgba(251, 194, 31, 0.2);
  
  .card-header {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: #fff;
    font-weight: 600;
    padding: 15px 20px;
    border: none;
  }
`;

const RelatedArticleItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid rgba(251, 194, 31, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(251, 194, 31, 0.1);
  }

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 10px;
    margin-right: 15px;
    border: 1px solid rgba(251, 194, 31, 0.3);
  }
  
  h6 {
    margin-bottom: 5px;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  &:hover h6 {
    color: var(--primary) !important;
  }
  
  small {
    display: block;
  }
`;

const ShareButton = styled(Button)`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #ffffff;
  transition: all 0.3s ease;
  margin: 5px;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    color: #fff;
    transform: translateY(-2px);
  }
`;

const BackButton = styled(Button)`
  background: linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%);
  border: none;
  color: var(--primary-dark);
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, var(--secondary-light) 0%, var(--secondary) 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(251, 194, 31, 0.3);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  
  .spinner-border {
    color: var(--primary);
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--primary);
    font-size: 1.2rem;
  }
`;

const RelatedArticlesContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f5f5f5;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--primary);
    border-radius: 4px;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  
  svg {
    margin-right: 8px;
  }
`;

const KnowledgeHubDetails = () => {
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

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
    <p className="text-center text-muted py-4">
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
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={relatedArticle.images?.[0] || profileImage}
            alt={relatedArticle.title}
          />
          <div>
            <h6 style={{ color: 'var(--primary-dark)' }}>
              {relatedArticle.title}
            </h6>
            <small className="text-muted">
              {relatedArticle.category} • {new Date(relatedArticle.createdAt).toLocaleDateString()}
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
        <Spinner animation="border" />
        <p>Loading article...</p>
      </LoadingContainer>
    );
  }

  if (!article) {
    return (
      <PageWrapper>
        <Container>
          <div className="text-center py-5">
            <FaBook size={50} color="var(--primary)" />
            <p className="mt-3 mb-4" style={{ fontSize: '1.2rem', color: 'var(--primary-dark)' }}>Article not found</p>
            <BackButton as={Link} to="/knowledge-hub">
              Back to Knowledge Hub
            </BackButton>
          </div>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <PageContent>
          <ArticleHeader>
            <Container>
              <Row>
                <Col>
                  <h1>{article.title}</h1>
                  <div className="d-flex flex-wrap align-items-center mt-4">
                    <MetaInfo>
                      <FaCalendar />
                      <span>
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </MetaInfo>
                    <MetaInfo>
                      <FaUserEdit />
                      <span>{article.author}</span>
                    </MetaInfo>
                    <div className="position-relative ms-auto">
                      <Button
                        variant="outline-light"
                        onClick={() => setShareOpen(!shareOpen)}
                        className="d-flex align-items-center"
                      >
                        <FaShareAlt className="me-2" /> Share
                      </Button>
                      {shareOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '12px',
                            padding: '15px',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                            zIndex: 10,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '10px',
                            marginTop: '10px',
                          }}
                        >
                          <ShareButton onClick={() => shareArticle('whatsapp')} style={{ background: '#25D366' }}>
                            <FaWhatsapp />
                          </ShareButton>
                          <ShareButton onClick={() => shareArticle('facebook')} style={{ background: '#3b5998' }}>
                            <FaFacebookF />
                          </ShareButton>
                          <ShareButton onClick={() => shareArticle('linkedin')} style={{ background: '#0077b5' }}>
                            <FaLinkedinIn />
                          </ShareButton>
                          <ShareButton onClick={() => shareArticle('twitter')} style={{ background: '#1da1f2' }}>
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
            <Col lg={8}>
              <ArticleContent>
                <img
                  src={article.images?.[0] || profileImage}
                  alt={article.title}
                  className="img-fluid mb-4"
                  style={{ borderRadius: '12px', width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                />

                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(article.content),
                  }}
                />
              </ArticleContent>

              <AuthorCard>
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={3} className="text-center">
                      <img
                        src={profileImage}
                        alt={article.author}
                        className="img-fluid"
                      />
                    </Col>
                    <Col md={9}>
                      <h4>{article.author}</h4>
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

            <Col lg={4}>
              <RelatedArticlesCard>
                <Card.Header>Related Articles</Card.Header>
                <Card.Body className="p-0">
                  <RelatedArticlesContainer>
                    {renderRelatedArticles()}
                  </RelatedArticlesContainer>
                </Card.Body>
              </RelatedArticlesCard>
            </Col>
          </Row>

          <div className="text-center mt-5 mb-4">
            <BackButton as={Link} to="/knowledge-hub" size="lg">
              Back to Knowledge Hub
            </BackButton>
          </div>
        </PageContent>
      </Container>
    </PageWrapper>
  );
};

export default KnowledgeHubDetails;