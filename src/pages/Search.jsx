import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Pagination } from 'react-bootstrap';
import { FaSearch, FaHeart } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAllPets, getAllAccessories, getAllAdverts } from '../contexts/api';
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

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .content {
    padding: 20px;
  }
`;

const VerifiedBadge = styled.div`
  display: inline-block;
  background-color: #0a6638;
  color: #fff;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 5px;
  margin-left: 10px;
`;

const SkeletonCard = styled(motion.div)`
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  height: 100%;
  
  .skeleton-img {
    width: 100%;
    height: 200px;
    background: #e9ecef;
  }
  
  .content {
    padding: 20px;
  }
`;

const Search = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pets');
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let response;
      switch(activeTab) {
        case 'pets':
          response = await getAllPets();
          setItems(response?.data?.pets || []);
          break;
        case 'accessories':
          response = await getAllAccessories();
          setItems(response?.data?.accessories || []);
          break;
        case 'advert':
          response = await getAllAdverts();
          setItems(response?.data?.adverts || []);
          break;
        default:
          setItems([]);
      }
    } catch (error) {
      toast.error('Error fetching items');
    }
    setLoading(false);
  };

  const filteredItems = items.filter(item => {
    const nameToSearch = item.name || item.title;
    return (
      nameToSearch?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.category === '' || item.category === filters.category) &&
      (filters.minPrice === '' || item.price >= Number(filters.minPrice)) &&
      (filters.maxPrice === '' || item.price <= Number(filters.maxPrice))
    );
  });

  const sortedItems = filteredItems.sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleViewDetails = (item) => {
    if (activeTab === 'pets') {
      navigate(`/ad/viewDetails/${item._id}`, { state: { advert: item } });
    } else if (activeTab === 'accessories') {
      navigate(`/ad/viewDetails/${item._id}`, { state: { advert: item } });
    } else if (activeTab === 'advert') {
      navigate(`/ad/${item._id}`, { state: { advert: item } });
    }
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
                  }}
                />
                <Form.Check
                  type="radio"
                  id="advert"
                  label="Advert"
                  checked={activeTab === 'advert'}
                  onChange={() => {
                    setActiveTab('advert');
                    setCurrentPage(1);
                  }}
                />
              </div>
              {(activeTab === 'pets' || activeTab === 'advert') && (
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select name="category" value={filters.category} onChange={handleFilterChange}>
                    <option value="">All Categories</option>
                    {activeTab === 'pets' && (
                      <>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Fish">Fish</option>
                      </>
                    )}
                    {activeTab === 'advert' && (
                      <>
                        <option value="pet">Pet</option>
                        <option value="accessory">Accessory</option>
                        <option value="service">Service</option>
                      </>
                    )}
                  </Form.Select>
                </Form.Group>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Price Range</Form.Label>
                <Row>
                  <Col>
                    <Form.Control type="number" placeholder="Min" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} />
                  </Col>
                  <Col>
                    <Form.Control type="number" placeholder="Max" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Sort By</Form.Label>
                <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                </Form.Select>
              </Form.Group>
            </FilterSection>
          </Col>
          <Col lg={9}>
            <SearchSection>
              <Form>
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
                    <Button variant="success" className="w-100" style={{ backgroundColor: '#0a6638', borderColor: '#0a6638' }}>
                      <FaSearch className="me-2" />
                      Search
                    </Button>
                  </Col>
                </Row>
              </Form>
            </SearchSection>
            
            <h2 className="my-4">
              {activeTab === 'pets' ? 'Pet Breeds' : activeTab === 'accessories' ? 'Pet Accessories' : 'Adverts'}
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
              ) : currentItems.length === 0 ? (
                <Col>
                  <div className="text-center py-5">
                    <h4>No items found</h4>
                  </div>
                </Col>
              ) : (
                currentItems.map(item => (
                  <Col md={4} key={item._id}>
                    <PetCard
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img src={item.image || item.images?.[0] || profileImage} alt={item.name || item.title} />
                      <div className="content">
                        <div className="d-flex align-items-center mb-2">
                          <h4>{item.name || item.title}</h4>
                          {activeTab === 'pets' && (
                            <VerifiedBadge>VERIFIED</VerifiedBadge>
                          )}
                        </div>
                        <div className="mb-2">
                          <strong>₹{item.price}</strong>
                        </div>
                        <div>{item.category}</div>
                        {activeTab === 'pets' && <div>{item.breed}</div>}
                        {activeTab === 'advert' && <div>{item.description?.substring(0, 50)}...</div>}
                        <div className="mt-3">
                          <Button 
                            variant="outline-success"
                            onClick={() => handleViewDetails(item)}
                            className="w-100"
                            style={{ borderColor: '#0a6638', color: '#0a6638' }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </PetCard>
                  </Col>
                ))
              )}
            </Row>
            {sortedItems.length > itemsPerPage && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  {[...Array(Math.ceil(sortedItems.length / itemsPerPage)).keys()].map(number => (
                    <Pagination.Item 
                      key={number + 1} 
                      active={number + 1 === currentPage}
                      onClick={() => paginate(number + 1)}
                    >
                      {number + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </StyledSearch>
  );
};

export default Search;