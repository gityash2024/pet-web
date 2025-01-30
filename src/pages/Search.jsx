import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaSearch, FaHeart } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getAllPets, getAllAccessories, toggleFavorite } from '../contexts/api';
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

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #fffacc;
  color: #0a6638;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
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
  const [activeTab, setActiveTab] = useState('pets');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [allItems, setAllItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [allItems, searchTerm, filters, sortBy]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === 'pets') {
        response = await getAllPets();
      } else {
        response = await getAllAccessories();
      }
      setAllItems(response.data[activeTab === 'pets' ? 'pets' : 'accessories']);
    } catch (error) {
      toast.error('Error fetching items');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filteredItems = allItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.category === '' || item.category === filters.category) &&
      (filters.minPrice === '' || item.price >= Number(filters.minPrice)) &&
      (filters.maxPrice === '' || item.price <= Number(filters.maxPrice)) &&
      (filters.location === '' || (item.location && item.location.toLowerCase().includes(filters.location.toLowerCase())))
    );

    filteredItems.sort((a, b) => {
      if (sortBy === 'price_low_high') return a.price - b.price;
      if (sortBy === 'price_high_low') return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setDisplayedItems(filteredItems.slice(0, page * itemsPerPage));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    applyFiltersAndSort();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const toggleFavoriteItem = async (id) => {
    try {
      await toggleFavorite(activeTab === 'pets' ? 'pet' : 'accessory', id);
      toast.success('Favorite status updated');
      setAllItems(prevItems => 
        prevItems.map(item => 
          item._id === id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );
    } catch (error) {
      toast.error('Error updating favorite status');
    }
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
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
                  onChange={() => setActiveTab('pets')}
                />
                <Form.Check
                  type="radio"
                  id="accessories"
                  label="Accessories"
                  checked={activeTab === 'accessories'}
                  onChange={() => setActiveTab('accessories')}
                />
              </div>
              {activeTab === 'pets' && (
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select name="category" value={filters.category} onChange={handleFilterChange}>
                    <option value="">All Categories</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Rodents">Rodents</option>
                    <option value="Reptiles">Reptiles</option>
                    <option value="Rabbits">Rabbits</option>
                    <option value="Fish">Fish</option>
                    <option value="Birds">Birds</option>
                    <option value="Invertebrates">Invertebrates</option>
                    <option value="Livestock">Livestock</option>
                    <option value="Poultry">Poultry</option>
                    <option value="Horses">Horses</option>
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
                <Form.Label>Keyword</Form.Label>
                <Form.Control type="text" placeholder="Search" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Type of listing</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="checkbox"
                    id="sale"
                    label="For sale"
                  />
                  <Form.Check
                    inline
                    type="checkbox"
                    id="adoption"
                    label="For adoption"
                  />
                </div>
                <div>
                  <Form.Check
                    inline
                    type="checkbox"
                    id="stud"
                    label="For stud"
                  />
                  <Form.Check
                    inline
                    type="checkbox"
                    id="wanted"
                    label="Wanted"
                  />
                </div>
              </Form.Group>
            </FilterSection>
          </Col>
          <Col lg={9}>
            <SearchSection>
              <Form onSubmit={handleSearch}>
                <Row className="align-items-center">
                  <Col sm={9}>
                    <Form.Control 
                      type="text"
                      placeholder="Search for pets, accessories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Col>
                  <Col sm={3}>
                    <Button type="submit" variant="success" className="w-100">
                      <FaSearch className="me-2" />
                      Search
                    </Button>
                  </Col>
                </Row>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <strong>19788</strong> Pets &amp; Animals for sale
                  </div>
                  <Form.Select value={sortBy} onChange={handleSortChange} className="w-auto">
                    <option value="newest">Date Published (Newest)</option>
                    <option value="price_low_high">Price (Low to High)</option>
                    <option value="price_high_low">Price (High to Low)</option>
                  </Form.Select>
                </div>
              </Form>
            </SearchSection>
            
            <h2 className="my-4">
              {activeTab === 'pets' ? 'Pet Breeds' : 'Pet Accessories'}
            </h2>
            <Row>
              {loading ? (
                [...Array(8)].map((_, index) => (
                  <Col md={4} key={index}>
                    <SkeletonCard>
                      <div className="skeleton-img" />
                      <div className="content">
                        <div className="skeleton-text mb-2" />
                        <div className="skeleton-text" />
                      </div>
                    </SkeletonCard>
                  </Col>
                ))
              ) : (
                displayedItems.map(item => (
                  <Col md={4} key={item._id}>
                    <PetCard
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.discount && (
                        <DiscountBadge>
                          Get 50% off entry
                        </DiscountBadge>
                      )}
                      <img src={item.images[0]||profileImage} alt={item.name} />
                      <div className="content">
                        <div className="d-flex align-items-center mb-2">
                          <h4>{item.name}</h4>
                          {activeTab === 'pets' && item.verified && (
                            <VerifiedBadge>VERIFIED</VerifiedBadge>
                          )}
                        </div>
                        <div className="mb-2">
                          <strong>£{item.price}</strong>
                        </div>
                        {activeTab === 'pets' && (
                          <>
                            <div>{item.category}</div>
                            <div>{item.breed}</div>
                          </>
                        )}
                        <div className="mt-3">
                          <Button 
                            variant="outline-success"
                            href={`/ad/${item._id}`}
                            className="w-100"
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

            {displayedItems.length === 0 && !loading && (
              <div className="text-center mt-5">
                <h3>No items found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}

            {!loading && displayedItems.length < allItems.length && (
              <div className="text-center mt-4">
                <Button variant="success" onClick={loadMore}>
                  Load More
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </StyledSearch>
  );
};

export default Search;