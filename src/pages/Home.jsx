import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShieldAlt, FaCreditCard, FaUserShield, FaTimes, FaFilter } from 'react-icons/fa';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllPets, getAllAccessories, getAllCategories } from '../contexts/api';
import { toast } from 'react-toastify';
import cardImage from '../assets/profile.png'
import { Placeholder } from 'react-bootstrap';

// Mobile view styles (from screenshot)
const MobileSearchSection = styled.div`
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  position: relative;
  margin: 15px;
  display: flex;
  align-items: center;
  
  .search-input-wrapper {
    flex: 1;
    position: relative;
  }
  
  .search-category {
    font-size: 12px;
    color: #666;
    margin-bottom: 2px;
  }
  
  .clear-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    cursor: pointer;
  }
`;

const MobileSearchInput = styled.input`
  width: 100%;
  padding: 10px 30px 10px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #0a6638;
  }
`;

const FilterButton = styled.button`
  background: none;
  border: none;
  color: #0a6638;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 15px;
  cursor: pointer;
  
  &:focus {
    outline: none;
  }
`;

const CategorySection = styled.div`
  padding: 15px;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  .category-count {
    font-size: 18px;
    margin-bottom: 15px;
    color: #333;
  }
`;

const CategoryButton = styled.button`
  padding: 10px 20px;
  margin-right: 10px;
  border-radius: 50px;
  border: 2px solid #e0e0e0;
  background-color: ${props => props.active ? '#0a6638' : '#fff'};
  color: ${props => props.active ? '#fff' : '#333'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
  }
  
  &:hover {
    border-color: #0a6638;
    color: ${props => props.active ? '#fff' : '#0a6638'};
  }
`;

const ChooseCategoryButton = styled(CategoryButton)`
  background-color: #0a6638;
  color: #fff;
  border-color: #0a6638;
`;

const AdvertSection = styled.div`
  padding: 15px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .ads-count {
    font-size: 18px;
    color: #333;
  }
  
  .boosted-label {
    text-align: center;
    font-size: 14px;
    color: #666;
    margin: 15px 0;
    position: relative;
    
    &::before, &::after {
      content: '';
      position: absolute;
      width: 25%;
      height: 1px;
      background-color: #e0e0e0;
      top: 50%;
    }
    
    &::before {
      left: 10%;
    }
    
    &::after {
      right: 10%;
    }
  }
`;

const MobilePetCard = styled(motion.div)`
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  
  .image-container {
    position: relative;
    width: 100%;
    height: 250px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .image-count {
      position: absolute;
      bottom: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      
      svg {
        margin-right: 5px;
      }
    }
    
    .boost-icon {
      position: absolute;
      top: 10px;
      left: 10px;
      background: #ffcc00;
      color: #333;
      padding: 5px;
      border-radius: 5px;
    }
  }
  
  .content {
    padding: 15px;
    
    .time-indicator {
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
    }
    
    .title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 5px;
      color: #333;
    }
    
    .price {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }
    
    .details {
      margin-top: 10px;
      
      .detail-row {
        display: flex;
        margin-bottom: 5px;
      }
      
      .detail-label {
        width: 100px;
        color: #666;
      }
      
      .detail-value {
        flex: 1;
        color: #333;
      }
    }
    
    .description {
      margin-top: 10px;
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }
    
    .boost-button {
      background-color: #ffcc00;
      color: #333;
      border: none;
      padding: 8px 16px;
      border-radius: 5px;
      font-weight: bold;
      margin-top: 10px;
      cursor: pointer;
      
      &:focus {
        outline: none;
      }
    }
  }
`;

// Original desktop styles
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

const SafetyIllustration = () => (
    <svg width="200" height="200" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M150 50C150 50 60 82 60 178C60 274 150 274 150 274C150 274 240 274 240 178C240 82 150 50 150 50Z" 
        fill="#0a6638"
      />
      <path 
        d="M120 180C120 180 140 200 150 200C160 200 180 180 180 180C180 180 160 220 150 220C140 220 120 180 120 180Z" 
        fill="#fffacc"
      />
      <circle cx="150" cy="140" r="40" fill="#fffacc"/>
      <path 
        d="M130 140L145 155L175 125" 
        stroke="#0a6638" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
  
const HeroSection = styled.section`
  background-color: #0a6638;
  color: #fff;
  padding: 60px 0;
  position: relative;
  overflow: hidden;
`;

const SearchSection = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  margin-bottom: 15px;
`;

const SearchButton = styled(Button)`
  width: 100%;
  background-color: #0a6638;
  border: none;
  padding: 15px;
  &:hover {
    background-color: #085530;
  }
`;

const SuggestionDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-top: none;
  border-radius: 0 0 10px 10px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const SuggestionItem = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #f8f9fa;
  }
`;

const SafetyCard = styled.div`
  background-color: #fffacc;
  padding: 30px;
  border-radius: 10px;
  margin: 40px 0;
  position: relative;
`;

const PetCard = styled(motion.div)`
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  .content {
    padding: 20px;
  }
`;

const FeatureBox = styled(motion.div)`
  text-align: center;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin: 20px 0;
  
  svg {
    color: #0a6638;
    font-size: 2rem;
    margin-bottom: 15px;
  }
`;

const NoDataSVG = () => (
  <svg width="120" height="120" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="120" cy="120" r="80" fill="#f5f5f5"/>
    <path d="M160 100c0 22.1-17.9 40-40 40s-40-17.9-40-40 17.9-40 40-40 40 17.9 40 40z" stroke="#0a6638" strokeWidth="8"/>
    <path d="M170 170l-25-25" stroke="#0a6638" strokeWidth="8" strokeLinecap="round"/>
    <path d="M120 80v40M100 100h40" stroke="#0a6638" strokeWidth="8" strokeLinecap="round"/>
  </svg>
);

const Home = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [totalPetCount, setTotalPetCount] = useState(0);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", 
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli", 
    "Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const [selectedLocation, setSelectedLocation] = useState('');

  // Handle window resize to switch between mobile and desktop views
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchFeaturedPets();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 1) {
      fetchSuggestions();
    } else {
      setSearchSuggestions([]);
    }
  }, [searchTerm]);

  const fetchFeaturedPets = async () => {
    try {
      const response = await getAllPets();
      setFeaturedPets(response.data.pets);
      setTotalPetCount(response.data.pets.length);
    } catch (error) {
      toast.error('Failed to fetch featured pets');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const [petsResponse, accessoriesResponse] = await Promise.all([
        getAllPets(),
        getAllAccessories()
      ]);

      const petSuggestions = petsResponse.data.pets
        .filter(pet => pet.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(pet => ({ ...pet, type: 'pet' }));

      const accessorySuggestions = accessoriesResponse.data.accessories
        .filter(accessory => accessory.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(accessory => ({ ...accessory, type: 'accessory' }));

      setSearchSuggestions([...petSuggestions, ...accessorySuggestions]);
    } catch (error) {
      toast.error('Failed to fetch suggestions');
      setSearchSuggestions([]);
    }
  };

  const handleSearch = () => {
    navigate(`/search?q=${searchTerm}&location=${selectedLocation}&category=${selectedCategory}`);
  };

  const handleSuggestionSelect = (item) => {
    navigate(`/ad/viewDetails/${item._id}`, { 
      state: { 
        advert: {
          _id: item._id,
          title: item.name,
          category: item.category,
          type: item.type,
          price: item.price,
          description: item.description,
          images: [item.images?.[0] || cardImage]
        } 
      } 
    });
  };

  const handleViewDetails = (pet) => {
    navigate(`/ad/viewDetails/${pet._id}`, {
      state: {
        advert: {
          ...pet,
          title: pet.name,
          images: [pet.images?.[0] || cardImage]
        }
      }
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchSuggestions([]);
  };

  const features = [
    {
      icon: <FaShieldAlt />,
      title: 'Trusted Security',
      description: 'We carefully verify all breeders and sellers to ensure a safe experience.'
    },
    {
      icon: <FaCreditCard />,
      title: 'Secure Payments',
      description: 'Our secure payment system ensures your transactions are protected.'
    },
    {
      icon: <FaUserShield />,
      title: 'Expert Support',
      description: 'Get advice from our pet experts to find your perfect companion.'
    }
  ];

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const searchVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.3
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Render mobile view
  const renderMobileView = () => {
    return (
      <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <MobileSearchSection>
          <div className="search-input-wrapper">
            <div className="search-category">Pets</div>
            <MobileSearchInput
              type="text"
              placeholder="All Pets"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <FaTimes className="clear-icon" onClick={clearSearch} />
            )}
          </div>
          <FilterButton onClick={() => navigate('/search')}>
            Filter
          </FilterButton>
        </MobileSearchSection>

        <CategorySection>
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            <ChooseCategoryButton>
              Choose a category
            </ChooseCategoryButton>
            {categories.map((category, index) => (
              <CategoryButton 
                key={index}
                active={selectedCategory === category.name}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </CategoryButton>
            ))}
          </div>
        </CategorySection>

        <AdvertSection>
          <div className="ads-count">
            {totalPetCount} Pets & Animals for sale
          </div>
          
          <div className="boosted-label">
            BOOSTED ADVERTS
          </div>

          {loading ? (
            Array(4).fill(0).map((_, index) => (
              <SkeletonCard key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="skeleton-img"></div>
                <div className="content">
                  <Placeholder as="p" animation="glow">
                    <Placeholder xs={8} />
                  </Placeholder>
                  <Placeholder as="p" animation="glow">
                    <Placeholder xs={12} />
                  </Placeholder>
                  <Placeholder as="p" animation="glow">
                    <Placeholder xs={4} />
                  </Placeholder>
                </div>
              </SkeletonCard>
            ))
          ) : (
            featuredPets.map((pet, index) => (
              <MobilePetCard 
                key={index}
                onClick={() => handleViewDetails(pet)}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="image-container">
                  <img src={pet.images?.[0] || cardImage} alt={pet.name} />
                  <div className="image-count">
                    <span>38</span>
                  </div>
                  {index === 0 && <div className="boost-icon">⚡</div>}
                </div>
                <div className="content">
                  <div className="time-indicator">20 seconds</div>
                  <div className="title">Fantastic Top {pet.name}s</div>
                  <div className="price">£{pet.price || 800}</div>
                  <div className="details">
                    <div className="detail-row">
                      <div className="detail-label">{pet.category || 'Pet Type'}:</div>
                      <div className="detail-value">{pet.breed || pet.name}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Age:</div>
                      <div className="detail-value">{pet.age || '4 months'}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Sex:</div>
                      <div className="detail-value">{pet.gender || '1 male / 3 female'}</div>
                    </div>
                  </div>
                  <div className="description">
                    {pet.description || `I'm selling my Fantastic 10 weeks Top ${pet.name}, all ready to go, please see the pictures.`}
                  </div>
                  <button className="boost-button">BOOST</button>
                </div>
              </MobilePetCard>
            ))
          )}
        </AdvertSection>
      </div>
    );
  };

  // Render desktop view (original layout)
  const renderDesktopView = () => {
    return (
      <>
        <HeroSection>
          <Container>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroVariants}
            >
              <Row className="align-items-center">
                <Col md={6}>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={heroVariants}
                  >
                    <h1>A safe start to a lifelong friendship</h1>
                    <p className="lead mb-4">Connect with trusted breeders and rescues</p>
                  </motion.div>
                </Col>
                <Col md={6}>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={searchVariants}
                  >
                    <SearchSection>
                      <h2>Find your perfect pet</h2>
                      <div style={{ position: 'relative' }}>
                        <SearchInput
                          type="text"
                          placeholder="Search for pets & accessories"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      {searchTerm.length > 1 && (
                        <SuggestionDropdown>
                          {searchSuggestions.length > 0 ? (
                            searchSuggestions.map((item, index) => (
                              <SuggestionItem 
                                key={index} 
                                onClick={() => handleSuggestionSelect(item)}
                              >
                                <img 
                                  src={item.images?.[0] || cardImage} 
                                  alt={item.name} 
                                  style={{ width: 50, height: 50, marginRight: 10, objectFit: 'cover' }}
                                />
                                <div>
                                  <strong style={{color: '#0a6638'}}>{item.name}</strong>
                                  <div style={{ fontSize: '0.8em', color: '#666' }}>
                                    {item.type === 'pet' ? 'Pet' : 'Accessory'} | ₹{item.price}
                                  </div>
                                </div>
                              </SuggestionItem>
                            ))
                          ) : (
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                              <NoDataSVG />
                              <p style={{ marginTop: '10px', color: '#666' }}>No results found</p>
                            </div>
                          )}
                        </SuggestionDropdown>
                      )}
                      </div>
                    
                      <SearchButton onClick={handleSearch}>
                        <FaSearch className="me-2" /> Search All Categories
                      </SearchButton>
                    </SearchSection>
                  </motion.div>
                </Col>
              </Row>
            </motion.div>
          </Container>
        </HeroSection>

        <Container className="my-5">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <Row>
              {features.map((feature, index) => (
                <Col md={4} key={index}>
                  <FeatureBox
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{scale: 1.05,
                      transition: { duration: 0.3 }
                    }}
                  >
                    {feature.icon}
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </FeatureBox>
                </Col>
              ))}
            </Row>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SafetyCard>
              <Row>
                <Col md={8}>
                  <h2>Need help? We're here to provide a safe start to your lifelong friendship</h2>
                  <p>We have a bunch of handy articles to answer common questions. Can't find what you're looking for? Contact our dedicated trust and safety team.</p>
                  <Button variant="success" as={Link} to="/knowledge-hub">Learn more about pet safety</Button>
                  <Button variant="warning" className="ms-3">I need help</Button>
                </Col>
                <Col md={4}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SafetyIllustration/>
                  </motion.div>
                </Col>
              </Row>
            </SafetyCard>
          </motion.div>

          <h2 className="mb-4">Featured Pets</h2>
          <Row>
            {loading ? (
              [...Array(4)].map((_, index) => (
                <Col md={3} key={`skeleton-${index}`}>
                  <SkeletonCard>
                    <div className="skeleton-img" />
                    <div className="content">
                      <Placeholder as="div" animation="glow">
                        <Placeholder xs={8} className="mb-2" />
                        <Placeholder xs={6} className="mb-2" />
                        <Placeholder xs={4} className="mb-3" />
                        <Placeholder.Button variant="success" xs={12} />
                      </Placeholder>
                    </div>
                  </SkeletonCard>
                </Col>
              ))
            ) : (
              <AnimatePresence>
                {featuredPets.slice(0, 4).map((pet) => (
                  <Col md={3} key={pet._id}>
                    <PetCard
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      whileHover={{ 
                        y: -10,
                        transition: { duration: 0.3 }
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <img src={pet.images?.[0] || cardImage} alt={pet.name} />
                      <div className="content">
                        <h3>{pet.name}</h3>
                        <p>{pet.breed}</p>
                        <p>₹ {pet.price}</p>
                        <Button 
                          variant="outline-success" 
                          onClick={() => handleViewDetails(pet)}
                          className="w-100"
                        >
                          View Details
                        </Button>
                      </div>
                    </PetCard>
                  </Col>
                ))}
              </AnimatePresence>
            )}
          </Row>
        </Container>
      </>
    );
  };

  // Conditionally render based on screen size
  return isMobileView ? renderMobileView() : renderDesktopView();
};

export default Home;