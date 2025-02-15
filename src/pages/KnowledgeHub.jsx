import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaFilter, FaTimes, FaBook } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAllArticles, getAllCategories } from '../contexts/api';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import profileImage from '../assets/profile.png';

const PageWrapper = styled.div`
  background-color: #f4f4f4;
  min-height: 100vh;
  padding: 40px 0;
`;

const FilterSidebar = styled(Card)`
  background-color: #fff;
  border: none;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border-radius: 12px;
  position: sticky;
  top: 100px;
  z-index: 10;
`;

const ArticleListContainer = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  padding: 20px;
`;

const ArticleCard = styled(motion.div)`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    transform: translateY(-5px);
  }

  .article-image {
    height: 250px;
    object-fit: cover;
    width: 100%;
  }

  .article-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
`;

const CategoryBadge = styled.span`
  background-color: #0a6638;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  margin-right: 10px;
`;

const FilterTag = styled.div`
  background-color: #fffacc;
  color: #0a6638;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 10px;
`;

const KnowledgeHub = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
  });

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const [articlesResponse, categoriesResponse] = await Promise.all([
        getAllArticles(),
        getAllCategories()
      ]);
      setArticles(articlesResponse.data.articles || []);
      const categoryNames = categoriesResponse.data.categories.map(cat => cat.name);
      setCategories(categoryNames);
    } catch (error) {
      toast.error('Failed to fetch articles and categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = !filters.search || 
        article.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        article.content.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategories = filters.categories.length === 0 || 
        filters.categories.includes(article.category);
      
      return matchesSearch && matchesCategories;
    });
  }, [articles, filters]);

  const toggleCategory = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const removeFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].filter(v => v !== value)
    }));
  };

  return (
    <PageWrapper>
      <Container>
        <Row>
          <Col md={3}>
            <FilterSidebar>
              <Card.Body>
                <h4 className="mb-4" style={{color: '#0a6638'}}>
                  <FaFilter className="me-2" /> Filters
                </h4>
                
                <Form.Group className="mb-3">
                  <Form.Label>Search Articles</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        search: e.target.value
                      }))}
                    />
                    <InputGroup.Text style={{backgroundColor: '#0a6638', color: '#fff'}}>
                      <FaSearch />
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Categories</Form.Label>
                  {categories.map(category => (
                    <Form.Check 
                      key={category}
                      type="checkbox"
                      label={category}
                      checked={filters.categories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      style={{color: '#0a6638'}}
                    />
                  ))}
                </Form.Group>
              </Card.Body>
            </FilterSidebar>
          </Col>
          
          <Col md={9}>
            <div className="d-flex align-items-center mb-4">
              <h1 style={{color: '#0a6638', marginRight: '20px'}}>Knowledge Hub</h1>
              {filters.categories.length > 0 && (
                <div className="d-flex">
                  {filters.categories.map(category => (
                    <FilterTag key={category}>
                      {category}
                      <Button 
                        variant="link" 
                        className="p-0 ms-2"
                        onClick={() => removeFilter('categories', category)}
                      >
                        <FaTimes color="#0a6638" />
                      </Button>
                    </FilterTag>
                  ))}
                </div>
              )}
            </div>

            <ArticleListContainer>
              {loading ? (
                <div className="text-center py-5">
                  <FaBook size={50} color="#0a6638" />
                  <p className="mt-3">Loading articles...</p>
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-5">
                  <FaBook size={50} color="#0a6638" />
                  <p className="mt-3">No articles found</p>
                </div>
              ) : (
                <Row>
                  {filteredArticles.map(article => (
                    <Col md={4} key={article._id} className="mb-4">
                      <ArticleCard
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img 
                          src={article.images?.[0] || profileImage} 
                          alt={article.title} 
                          className="article-image"
                        />
                        <div className="p-3 article-content">
                          <div className="d-flex align-items-center mb-2">
                            <CategoryBadge>{article.category}</CategoryBadge>
                            <small className="text-muted">
                              {new Date(article.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          <h3>{article.title}</h3>
                          <div 
                            className="text-muted mb-3 flex-grow-1"
                            dangerouslySetInnerHTML={{ 
                              __html: DOMPurify.sanitize(
                                article.content.substring(0, 200) + '...'
                              ) 
                            }}
                          />
                          <div className="d-flex justify-content-between align-items-center mt-auto">
                            <Button 
                              as={Link} 
                              to={`/knowledge-hub-details/${article._id}`} 
                              variant="outline-success"
                            >
                              Read More
                            </Button>
                            <div className="text-muted">
                              By {article.author}
                            </div>
                          </div>
                        </div>
                      </ArticleCard>
                    </Col>
                  ))}
                </Row>
              )}
            </ArticleListContainer>
          </Col>
        </Row>
      </Container>
    </PageWrapper>
  );
};

export default KnowledgeHub;