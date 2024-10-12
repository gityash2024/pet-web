import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Pagination } from 'react-bootstrap';
import { FaSearch, FaBookmark, FaRegBookmark, FaChevronLeft, FaChevronRight, FaNewspaper } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getAllArticles, bookmarkArticle, unbookmarkArticle } from '../contexts/api';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
const NoArticlesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
`;

const NoArticlesIcon = styled(FaNewspaper)`
  font-size: 5rem;
  color: ${props => props.isDarkMode ? '#ffffff4d' : '#00000033'};
  margin-bottom: 1rem;
`;

const StyledKnowledgeHub = styled.div`
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
  padding: 20px;
  margin-bottom: 20px;
`;

const StyledCard = styled(Card)`
  background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.7)'};
  border: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StyledBadge = styled(Badge)`
  background-color: ${props => props.isDarkMode ? '#4CAF50' : '#28a745'};
  margin-right: 5px;
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

const KnowledgeHub = ({ isDarkMode }) => {
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage] = useState(9);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const response = await getAllArticles();
            setArticles(response.data.articles);
        } catch (error) {
            toast.error('Failed to fetch articles');
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setCurrentPage(1);
    };

    const toggleBookmark = async (id, isBookmarked) => {
        try {
            if (isBookmarked) {
                await unbookmarkArticle(id);
            } else {
                await bookmarkArticle(id);
            }
            fetchArticles(); // Refetch articles to update the bookmarked status
        } catch (error) {
            toast.error('Failed to update bookmark');
        }
    };

    // Filter and paginate articles
    const filteredArticles = articles.filter(article => 
        (category === 'all' || article.category === category) &&
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <StyledKnowledgeHub isDarkMode={isDarkMode}>
            <Container>
                <h1 className="text-center mb-4">Knowledge Hub</h1>
                <GlassmorphicCard isDarkMode={isDarkMode}>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={6} className="text-md-end mt-3 mt-md-0">
                            <Form.Select value={category} onChange={handleCategoryChange}>
                                <option value="all">All Categories</option>
                                <option value="Care">Care</option>
                                <option value="Training">Training</option>
                                <option value="Nutrition">Nutrition</option>
                                <option value="Adoption">Adoption</option>
                                <option value="Health">Health</option>
                                <option value="Lifestyle">Lifestyle</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </GlassmorphicCard>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : filteredArticles.length === 0 ? (
                    <NoArticlesContainer>
                        <NoArticlesIcon isDarkMode={isDarkMode} />
                        <h3>No articles found</h3>
                    </NoArticlesContainer>
                ) : (
                    <>
                        <Row>
                            {currentArticles.map(article => (
                                <Col key={article._id} lg={4} md={6} className="mb-4">
                                    <StyledCard isDarkMode={isDarkMode}>
                                        <Card.Img variant="top" src={article.images[0] || 'https://via.placeholder.com/300x200'} />
                                        <Card.Body>
                                            <Card.Title>{article.title}</Card.Title>
                                            <Card.Text dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content.substring(0, 150) + '...') }} />
                                            <div className="d-flex justify-content-between align-items-center">
                                                <StyledBadge isDarkMode={isDarkMode}>{article.category}</StyledBadge>
                                                <Button
                                                    variant="link"
                                                    onClick={() => toggleBookmark(article._id, article.isBookmarked)}
                                                >
                                                    {article.isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                                                </Button>
                                            </div>
                                            <StyledButton as={Link} to={`/knowledge-hub-details/${article._id}`} className="w-100 mt-2">
                                                Read More
                                            </StyledButton>
                                        </Card.Body>
                                    </StyledCard>
                                </Col>
                            ))}
                        </Row>

                        <Pagination className="justify-content-center mt-4">
                            <Pagination.Prev
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft />
                            </Pagination.Prev>
                            {[...Array(Math.ceil(filteredArticles.length / articlesPerPage)).keys()].map(number => (
                                <Pagination.Item
                                    key={number + 1}
                                    active={number + 1 === currentPage}
                                    onClick={() => paginate(number + 1)}
                                >
                                    {number + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === Math.ceil(filteredArticles.length / articlesPerPage)}
                            >
                                <FaChevronRight />
                            </Pagination.Next>
                        </Pagination>
                    </>
                )}
            </Container>
        </StyledKnowledgeHub>
    );
};

KnowledgeHub.propTypes = {
    isDarkMode: PropTypes.bool.isRequired
};

export default KnowledgeHub;