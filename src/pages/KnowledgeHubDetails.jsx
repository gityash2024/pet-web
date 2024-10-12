import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Image, Overlay, Popover } from 'react-bootstrap';
import { FaBookmark, FaRegBookmark, FaShare, FaWhatsapp, FaFacebookF, FaInstagram, FaTelegramPlane, FaCopy } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import { getArticleById, bookmarkArticle, unbookmarkArticle } from '../contexts/api';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';

const StyledKnowledgeDetails = styled.div`
  background-color: ${props => props.isDarkMode ? '#1a1a1a' : '#f8f9fa'};
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
  min-height: 100vh;
  padding: 80px 0;
`;

const GlassmorphicCard = styled(motion.div)`
  background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding: 30px;
  margin-bottom: 30px;
`;

const StyledButton = styled(Button)`
   background-color: #4CAF50;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 5px;
  margin-right: 5px;
  float: right;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  transition: background-color 0.3s ease;
  border: none;
  &:hover {
    background-color: #45a049;
  }
`;

const ArticleImage = styled(Image)`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 15px;
  margin-bottom: 30px;
`;

const ArticleContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }

  p {
    margin-bottom: 1em;
  }

  img {
    max-width: 100%;
    height: auto;
    margin: 1em 0;
  }

  blockquote {
    border-left: 4px solid #4CAF50;
    padding-left: 1em;
    margin-left: 0;
    font-style: italic;
  }
`;

const ShareButton = styled(Button)`
  background: none;
  border: none;
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
  padding: 0;
  font-size: 1.2rem;

  &:hover, &:focus {
    color: #4CAF50;
  }
`;

const SharePopover = styled(Popover)`
  .popover-body {
    display: flex;
    justify-content: space-around;
    padding: 10px;
  }
`;

const ShareIcon = styled.div`
  cursor: pointer;
  font-size: 1.5rem;
  color: ${props => props.color};
  
  &:hover {
    opacity: 0.8;
  }
`;


const KnowledgeDetails = ({ isDarkMode }) => {
    const [article, setArticle] = useState(null);
    const { id } = useParams();
    const shareTarget = useRef(null);
    const [showShareOptions, setShowShareOptions] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await getArticleById(id);
                setArticle(response.data.article);
            } catch (error) {
                toast.error('Failed to fetch article');
            }
        };

        fetchArticle();
    }, [id]);

    const toggleBookmark = async () => {
        try {
            if (article.isBookmarked) {
                await unbookmarkArticle(article._id);
            } else {
                await bookmarkArticle(article._id);
            }
            setArticle(prevArticle => ({
                ...prevArticle,
                isBookmarked: !prevArticle.isBookmarked
            }));
        } catch (error) {
            toast.error('Failed to update bookmark');
        }
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `Check out this article: ${article.title}`;

        switch (platform) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'instagram':
                // Instagram doesn't have a direct share URL, so we'll just copy the link
                navigator.clipboard.writeText(url);
                toast.success('Link copied! You can now share it on Instagram.');
                break;
            case 'telegram':
                window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard!');
                break;
            default:
                break;
        }

        setShowShareOptions(false);
    };

    if (!article) {
        return <div>Loading...</div>;
    }


    return (
        <StyledKnowledgeDetails isDarkMode={isDarkMode}>
            <Container>
                <GlassmorphicCard
                    isDarkMode={isDarkMode}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="mb-4">{article.title}</h1>
                    <ArticleImage src={article.images[0] || 'https://via.placeholder.com/800x400'} alt={article.title} fluid />
                    <Row className="mb-4">
                        <Col>
                            <p>By {article.author} | {new Date(article.createdAt).toLocaleDateString()}</p>
                        </Col>
                        <Col className="text-end">
                            <Button variant="link" onClick={toggleBookmark}>
                                {article.isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                            </Button>
                            <ShareButton 
                                ref={shareTarget}
                                onClick={() => setShowShareOptions(!showShareOptions)}
                                isDarkMode={isDarkMode}
                            >
                                <FaShare />
                            </ShareButton>
                            <Overlay
                                target={shareTarget.current}
                                show={showShareOptions}
                                placement="bottom"
                            >
                                <SharePopover id="share-popover">
                                    <SharePopover.Body>
                                        <ShareIcon color="#25D366" onClick={() => handleShare('whatsapp')}><FaWhatsapp /></ShareIcon>
                                        <ShareIcon color="#1877F2" onClick={() => handleShare('facebook')}><FaFacebookF /></ShareIcon>
                                        <ShareIcon color="#E4405F" onClick={() => handleShare('instagram')}><FaInstagram /></ShareIcon>
                                        <ShareIcon color="#0088cc" onClick={() => handleShare('telegram')}><FaTelegramPlane /></ShareIcon>
                                        <ShareIcon color="#333333" onClick={() => handleShare('copy')}><FaCopy /></ShareIcon>
                                    </SharePopover.Body>
                                </SharePopover>
                            </Overlay>
                        </Col>
                    </Row>
                    <ArticleContent dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
                    <Row className="mt-4">
                        <Col>
                            <StyledButton as={Link} to="/knowledge-hub">
                                Back to Knowledge Hub
                            </StyledButton>
                        </Col>
                    </Row>
                </GlassmorphicCard>
            </Container>
        </StyledKnowledgeDetails>
    );
};

KnowledgeDetails.propTypes = {
    isDarkMode: PropTypes.bool.isRequired
};

export default KnowledgeDetails;