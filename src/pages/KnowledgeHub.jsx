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

const PageTitle = styled.h1`
  color: var(--primary);
  font-weight: 700;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  }
`;

const FilterSidebar = styled(Card)`
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border: 1px solid rgba(251, 194, 31, 0.2);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  border-radius: 15px;
  position: sticky;
  top: 100px;
  z-index: 10;
`;

const ArticleListContainer = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 248, 248, 0.8) 100%);
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  padding: 25px;
  border: 1px solid rgba(251, 194, 31, 0.2);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
    border-radius: 15px 15px 0 0;
  }
`;

const ArticleCard = styled(motion.div)`
  background: #ffffff;
  border: 1px solid rgba(251, 194, 31, 0.2);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);

  &:hover {
    box-shadow: 0 12px 30px rgba(192, 49, 21, 0.15);
    transform: translateY(-5px);
    border: 1px solid var(--secondary);
  }

  .article-image {
    height: 220px;
    object-fit: cover;
    width: 100%;
    border-bottom: 1px solid rgba(251, 194, 31, 0.2);
  }

  .article-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
  
  .article-title {
    color: var(--primary-dark);
    font-weight: 600;
    margin-bottom: 10px;
    font-size: 1.3rem;
  }
  
  .article-date {
    color: var(--primary-light);
    font-size: 0.9rem;
    margin-bottom: 15px;
  }
  
  .article-excerpt {
    color: var(--text-dark);
    margin-bottom: 15px;
    line-height: 1.6;
    font-size: 0.95rem;
  }
`;

const CategoryBadge = styled.span`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #fff;
  padding: 5px 12px;
  border-radius: 50px;
  font-size: 0.8rem;
  margin-right: 10px;
  font-weight: 500;
`;

const FilterTag = styled.div`
  background: linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%);
  color: var(--primary-dark);
  padding: 6px 12px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 10px;
  font-weight: 500;
`;

const SearchInput = styled(Form.Control)`
  border: 1px solid rgba(192, 49, 21, 0.2);
  border-radius: 8px 0 0 8px;
  padding: 10px 15px;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 0.2rem rgba(192, 49, 21, 0.15);
  }
`;

const SearchButton = styled(InputGroup.Text)`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
  }
`;

const ReadMoreButton = styled(Button)`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border: none;
  padding: 8px 16px;
  transition: all 0.3s ease;
  border-radius: 8px;
  font-weight: 500;
  color: #ffffff;
  
  &:hover {
    background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(192, 49, 21, 0.3);
  }
`;

const FilterLabel = styled(Form.Label)`
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 10px;
`;

const CategoryCheckbox = styled(Form.Check)`
  color: var(--primary-dark);
  margin-bottom: 10px;
  
  input:checked + label {
    color: var(--primary);
    font-weight: 500;
  }
`;

const SectionTitle = styled.h4`
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 1.2rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  }
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
        <PageContent>
          <Row>
            <Col md={3}>
              <FilterSidebar>
                <Card.Body>
                  <SectionTitle className="mb-4">
                    <FaFilter className="me-2" /> Filters
                  </SectionTitle>
                  
                  <Form.Group className="mb-4">
                    <FilterLabel>Search Articles</FilterLabel>
                    <InputGroup>
                      <SearchInput
                        type="text"
                        placeholder="Search..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          search: e.target.value
                        }))}
                      />
                      <SearchButton>
                        <FaSearch />
                      </SearchButton>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <FilterLabel>Categories</FilterLabel>
                    {categories.map(category => (
                      <CategoryCheckbox 
                        key={category}
                        type="checkbox"
                        label={category}
                        checked={filters.categories.includes(category)}
                        onChange={() => toggleCategory(category)}
                      />
                    ))}
                  </Form.Group>
                </Card.Body>
              </FilterSidebar>
            </Col>
            
            <Col md={9}>
              <div className="d-flex align-items-center mb-4">
                <PageTitle>Knowledge Hub</PageTitle>
              </div>
              
              {filters.categories.length > 0 && (
                <div className="d-flex flex-wrap mb-4">
                  {filters.categories.map(category => (
                    <FilterTag key={category}>
                      {category}
                      <Button 
                        variant="link" 
                        className="p-0 ms-2"
                        onClick={() => removeFilter('categories', category)}
                      >
                        <FaTimes color="var(--primary-dark)" />
                      </Button>
                    </FilterTag>
                  ))}
                </div>
              )}

              <ArticleListContainer>
                {loading ? (
                  <div className="text-center py-5">
                    <FaBook size={50} color="var(--primary)" className="mb-3" />
                    <p style={{color: 'var(--primary)', fontSize: '1.1rem'}}>Loading articles...</p>
                  </div>
                ) : filteredArticles.length === 0 ? (
                  <div className="text-center py-5">
                    <FaBook size={50} color="var(--primary)" className="mb-3" />
                    <p style={{color: 'var(--primary)', fontSize: '1.1rem'}}>No articles found</p>
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
                          <div className="article-content">
                            <div className="d-flex align-items-center mb-2">
                              <CategoryBadge>{article.category}</CategoryBadge>
                              <span className="article-date">
                                {new Date(article.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="article-title">{article.title}</h3>
                            <div 
                              className="article-excerpt"
                              dangerouslySetInnerHTML={{ 
                                __html: DOMPurify.sanitize(
                                  article.content.substring(0, 150) + '...'
                                ) 
                              }}
                            />
                            <div className="d-flex justify-content-between align-items-center mt-auto">
                              <ReadMoreButton 
                                as={Link} 
                                to={`/knowledge-hub-details/${article._id}`} 
                              >
                                Read More
                              </ReadMoreButton>
                              <div style={{color: 'var(--primary)'}}>
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
        </PageContent>
      </Container>
    </PageWrapper>
  );
};

export default KnowledgeHub;