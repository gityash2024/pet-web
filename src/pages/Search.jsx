import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Pagination } from 'react-bootstrap';
import { FaSearch, FaHeart } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAllPets, getAllAccessories, getAllCategories } from '../contexts/api';
import profileImage from '../assets/profile.png';

const StyledSearch = styled.div`
  min-height: 100vh;
  padding: 20px 0;
  background-color: #f8f9fa;
`;

const SearchSection = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const FilterSection = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const PetCard = styled(motion.div)` 
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  position: relative;
  margin-bottom: 20px;
  height: 450px;
  display: flex;
  flex-direction: column;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .content {
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .button-container {
    margin-top: auto;
    padding: 0 20px 20px 20px;
  }
`;

const Badge = styled.span`
  display: inline-block;
  background-color: ${props => props.type === 'verified' ? '#0a6638' : '#fffacc'};
  color: ${props => props.type === 'verified' ? '#fff' : '#0a6638'};
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 5px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const SkeletonCard = styled(motion.div)`
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  height: 450px;
  margin-bottom: 20px;
  
  .skeleton-img {
    width: 100%;
    height: 200px;
    background: #e9ecef;
  }
  
  .content {
    padding: 20px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  
  .pagination {
    .page-item {
      .page-link {
        color: #0a6638;
        &:focus {
          box-shadow: none;
        }
      }
      &.active .page-link {
        background-color: #0a6638;
        border-color: #0a6638;
        color: #fff;
      }
    }
  }
`;

const Search = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
      setActiveTab('pets');  // Since categories are only for pets
      setFilters(prev => ({
        ...prev,
        category: categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)  // Capitalize first letter
      }));
    }
  }, []);
  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      let petsData = [];
      let accessoriesData = [];

      if (activeTab === 'all' || activeTab === 'pets') {
        const petsResponse = await getAllPets();
        petsData = petsResponse.data.pets || [];
      }

      if (activeTab === 'all' || activeTab === 'accessories') {
        const accessoriesResponse = await getAllAccessories();
        accessoriesData = accessoriesResponse.data.accessories || [];
      }

      const combinedItems = activeTab === 'all' 
        ? [...petsData, ...accessoriesData]
        : activeTab === 'pets' 
          ? petsData 
          : accessoriesData;

      setItems(combinedItems);
    } catch (error) {
      toast.error('Error fetching items');
    }
    setLoading(false);
  };

  const filteredItems = items.filter(item => {
    const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesMinPrice = !filters.minPrice || item.price >= Number(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || item.price <= Number(filters.maxPrice);
    const isCorrectType = activeTab === 'all' || 
      (activeTab === 'pets' && 'breed' in item) || 
      (activeTab === 'accessories' && !('breed' in item));

    return matchesSearchTerm && matchesCategory && matchesMinPrice && matchesMaxPrice && isCorrectType;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleViewDetails = (item) => {
    navigate(`/ad/viewDetails/${item._id}`, { state: { advert: item } });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <StyledSearch>
      <Container>
        <Row>
          <Col lg={3}>
            <FilterSection>
              <h4>Filter</h4>
              <div className="mb-3">
                <Form.Check
                  type="radio"
                  id="all"
                  label="All"
                  checked={activeTab === 'all'}
                  onChange={() => {
                    setActiveTab('all');
                    setCurrentPage(1);
                    setFilters(prev => ({ ...prev, category: '' }));
                  }}
                />
                <Form.Check
                  type="radio"
                  id="pets"
                  label="Pets"
                  checked={activeTab === 'pets'}
                  onChange={() => {
                    setActiveTab('pets');
                    setCurrentPage(1);
                  }}
                />
                <Form.Check
                  type="radio"
                  id="accessories"
                  label="Accessories"
                  checked={activeTab === 'accessories'}
                  onChange={() => {
                    setActiveTab('accessories');
                    setCurrentPage(1);
                    setFilters(prev => ({ ...prev, category: '' }));
                  }}
                />
              </div>

              {(activeTab === 'pets' || activeTab === 'all') && (
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select name="category" value={filters.category} onChange={handleFilterChange}>
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Price Range</Form.Label>
                <Row>
                  <Col>
                    <Form.Control 
                      type="number" 
                      placeholder="Min" 
                      name="minPrice" 
                      value={filters.minPrice} 
                      onChange={handleFilterChange}
                    />
                  </Col>
                  <Col>
                    <Form.Control 
                      type="number" 
                      placeholder="Max" 
                      name="maxPrice" 
                      value={filters.maxPrice} 
                      onChange={handleFilterChange}
                    />
                  </Col>
                </Row>
              </Form.Group>
            </FilterSection>
          </Col>

          <Col lg={9}>
            <SearchSection>
              <Form onSubmit={handleSearchSubmit}>
                <Row className="align-items-center">
                  <Col sm={9}>
                    <Form.Control 
                      type="text"
                      placeholder="Search for pets, accessories..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </Col>
                  <Col sm={3}>
                    <Button 
                      type="submit" 
                      className="w-100" 
                      style={{ backgroundColor: '#0a6638', borderColor: '#0a6638' }}
                    >
                      <FaSearch className="me-2" />
                      Search
                    </Button>
                  </Col>
                </Row>
              </Form>
            </SearchSection>

            <h2 className="my-4">
              {activeTab === 'pets' ? 'Pet Breeds' : 
               activeTab === 'accessories' ? 'Pet Accessories' : 
               'All Items'}
            </h2>

            <Row>
              {loading ? (
                [...Array(6)].map((_, index) => (
                  <Col md={4} key={index}>
                    <SkeletonCard>
                      <div className="skeleton-img" />
                      <div className="content">
                        <div className="skeleton-text" />
                      </div>
                    </SkeletonCard>
                  </Col>
                ))
              ) : currentItems.length > 0 ? (
                currentItems.map(item => (
                  <Col md={4} key={item._id}>
                    <PetCard
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img src={item.images?.[0] || profileImage} alt={item.name} />
                      <div className="content">
                        <div className="d-flex align-items-center mb-2">
                          <h4>{item.name}</h4>
                          {'breed' in item && <Badge type="verified">VERIFIED</Badge>}
                        </div>
                        <div className="mb-2">
                          <strong>₹ {item.price}</strong>
                        </div>
                        <BadgeContainer>
                         { 'category' in item && <Badge type="label">Type: {item.category}</Badge>}
                          {'breed' in item && <Badge type="label">Breed: {item.breed}</Badge>}
                        </BadgeContainer>
                      </div>
                      <div className="button-container">
                        <Button 
                          variant="outline-success"
                          onClick={() => handleViewDetails(item)}
                          className="w-100"
                          style={{ borderColor: '#0a6638', color: '#0a6638' }}
                        >
                          View Details
                        </Button>
                      </div>
                    </PetCard>
                  </Col>
                ))
              ) : (
                <Col>
                  <p className="text-center">No items found</p>
                </Col>
              )}
            </Row>

            {!loading && totalPages > 1 && (
              <PaginationContainer>
                <Pagination>
                  <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                  <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={currentPage === index + 1}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                  <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
              </PaginationContainer>
            )}
          </Col>
        </Row>
      </Container>
    </StyledSearch>
  );
};

export default Search;