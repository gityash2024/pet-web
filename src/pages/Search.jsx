import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge, Tabs, Tab, Modal } from 'react-bootstrap';
import { FaSearch, FaFilter, FaHeart, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { getAllPets, getAllAccessories, toggleFavorite } from '../contexts/api';

const StyledSearch = styled.div`
  background-color: ${props => props.isDarkMode ? '#1a1a1a' : '#f8f9fa'};
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
  min-height: 100vh;
  padding: 80px 0;
`;

const SearchBar = styled.div`
  background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(10px);
  border-radius: 50px;
  padding: 10px 20px;
  margin: 0 auto 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
`;

const FilterSection = styled(motion.div)`
  background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
`;

const StyledCard = styled(motion(Card))`
  background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(5px);
  border: none;
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardImage = styled(Card.Img)`
  height: 200px;
  object-fit: cover;
`;

const StyledBadge = styled(Badge)`
  background-color: ${props => props.isDarkMode ? '#4CAF50' : '#28a745'};
  margin-right: 5px;
`;

const StyledButton = styled(Button)`
  background-color: rgba(76, 175, 80, 0.75);
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
  backdrop-filter: blur(5px);
  border-radius: 12px;

  &:hover {
    background-color: rgba(69, 160, 73, 0.75);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(2px);
  }
`;

const FavoriteButton = styled(motion.button)`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
`;

const ClearFilterButton = styled(Button)`
  padding: 2px 5px;
  font-size: 12px;
  margin-left: 5px;
`;

const Search = ({ isDarkMode }) => {
  const [activeTab, setActiveTab] = useState('pets');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

    // Sort items
    filteredItems.sort((a, b) => {
      if (sortBy === 'price_low_high') return a.price - b.price;
      if (sortBy === 'price_high_low') return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt); // newest
    });

    setDisplayedItems(filteredItems.slice(0, page * 12));
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

  const clearFilter = (filterName) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: ''
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

  const openItemDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <StyledSearch isDarkMode={isDarkMode}>
      <Container>
        <h1 className="text-center mb-4">Find Your Perfect Pet or Accessory</h1>
        <SearchBar isDarkMode={isDarkMode}>
          <Form onSubmit={handleSearch}>
            <Form.Group as={Row} className="mb-3 align-items-center">
              <Col sm={9}>
                <Form.Control
                  type="text"
                  placeholder="Search for pets, breeds, or accessories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col sm={3}>
                <StyledButton type="submit" className="w-100">
                  <FaSearch /> Search
                </StyledButton>
              </Col>
            </Form.Group>
          </Form>
        </SearchBar>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => {
            setActiveTab(k);
            setPage(1);
            setDisplayedItems([]);
          }}
          className="mb-3"
        >
          <Tab eventKey="pets" title="Pet Breeds">
            <h2>Pet Breeds</h2>
          </Tab>
          <Tab eventKey="accessories" title="Pet Accessories">
            <h2>Pet Accessories</h2>
          </Tab>
        </Tabs>

        <Row className="mb-3">
          <Col md={6}>
            <Button variant="outline-primary" onClick={() => setShowFilters(!showFilters)}>
              <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Col>
          <Col md={6} className="text-md-end">
            <Form.Group as={Row}>
              <Form.Label column sm={6} className="text-md-end">
                Sort by:
              </Form.Label>
              <Col sm={6}>
                <Form.Select value={sortBy} onChange={handleSortChange}>
                  <option value="newest">Newest</option>
                  <option value="price_low_high">Price: Low to High</option>
                  <option value="price_high_low">Price: High to Low</option>
                </Form.Select>
              </Col>
            </Form.Group>
          </Col>
        </Row>

        <AnimatePresence>
          {showFilters && (
            <FilterSection
              isDarkMode={isDarkMode}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Form>
                <Row>
                  {activeTab === 'pets' && (
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Category
                          {filters.category && (
                            <ClearFilterButton variant="link" onClick={() => clearFilter('category')}>
                              <FaTimes />
                            </ClearFilterButton>
                          )}
                        </Form.Label>
                        <Form.Select name="category" value={filters.category} onChange={handleFilterChange}>
                          <option value="">All Categories</option>
                          <option value="Dog">Dog</option>
                          <option value="Cat">Cat</option>
                          <option value="Fish">Fish</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  )}
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Min Price
                        {filters.minPrice && (
                          <ClearFilterButton variant="link" onClick={() => clearFilter('minPrice')}>
                            <FaTimes />
                          </ClearFilterButton>
                        )}
                      </Form.Label>
                      <Form.Control type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Max Price
                        {filters.maxPrice && (
                          <ClearFilterButton variant="link" onClick={() => clearFilter('maxPrice')}>
                            <FaTimes />
                          </ClearFilterButton>
                        )}
                      </Form.Label>
                      <Form.Control type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Location
                        {filters.location && (
                          <ClearFilterButton variant="link" onClick={() => clearFilter('location')}>
                            <FaTimes />
                          </ClearFilterButton>
                        )}
                      </Form.Label>
                      <Form.Control type="text" name="location" value={filters.location} onChange={handleFilterChange} />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </FilterSection>
          )}
        </AnimatePresence>

        <Row>
          {displayedItems.map(item => (
            <Col key={item._id} lg={3} md={4} sm={6} className="mb-4">
              <StyledCard isDarkMode={isDarkMode}>
                <CardImage variant="top" src={item.images[0]} />
                <FavoriteButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleFavoriteItem(item._id)}
                >
                  <FaHeart color={item.isFavorite ? "red" : "gray"} />
                </FavoriteButton>
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    {activeTab === 'pets' && (
                      <StyledBadge isDarkMode={isDarkMode}>{item.category}</StyledBadge>
                    )}
                    <StyledBadge isDarkMode={isDarkMode}>${item.price}</StyledBadge>
                  </Card.Text>
                  {activeTab === 'pets' && (
                    <Card.Text>Breed: {item.breed}</Card.Text>
                  )}
                  <StyledButton onClick={() => openItemDetails(item)} className="w-100">View Details</StyledButton>
                </Card.Body>
              </StyledCard>
            </Col>
          ))}
        </Row>

        {displayedItems.length === 0 && !loading && (
          <div className="text-center mt-5">
            <h3>No items found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {loading && (
          <div className="text-center mt-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!loading && displayedItems.length < allItems.length && (
          <div className="text-center mt-4">
            <StyledButton onClick={loadMore}>Load More</StyledButton>
          </div>
        )}
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <Row>
              <Col md={6}>
                <img src={selectedItem.images[0]} alt={selectedItem.name} className="img-fluid rounded" />
              </Col>
              <Col md={6}>
                <p><strong>Price:</strong> ${selectedItem.price}</p>
                {activeTab === 'pets' && (
                  <>
                    <p><strong>Category:</strong> {selectedItem.category}</p>
                    <p><strong>Breed:</strong> {selectedItem.breed}</p>
                    <p><strong>Age:</strong> {selectedItem.age} years</p>
                  </>
                )}
                <p><strong>Description:</strong> {selectedItem.description}</p>
                {activeTab === 'pets' && selectedItem.location && (
                  <p><strong>Location:</strong> {selectedItem.location}</p>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={() => {/* Add contact seller logic here */}}>
            Contact Seller
          </Button>
        </Modal.Footer>
      </Modal>
    </StyledSearch>
  );
};

Search.propTypes = {
  isDarkMode: PropTypes.bool.isRequired
};

export default Search;
          