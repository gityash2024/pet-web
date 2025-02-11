import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShieldAlt, FaCreditCard, FaUserShield } from 'react-icons/fa';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllPets, getAllAccessories, getAllCategories } from '../contexts/api';
import { toast } from 'react-toastify';
import cardImage from '../assets/profile.png'
import { Placeholder } from 'react-bootstrap';

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

const Home = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
  const [selectedCategory, setSelectedCategory] = useState('');

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
      setFeaturedPets(response.data.pets.slice(0, 4));
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
    setSearchSuggestions([]);
  };

  const handleViewDetails = (pet) => {
    navigate(`/ad/viewDetails/${pet._id}`, { 
      state: { 
        advert: {
          _id: pet._id,
          title: pet.name,
          category: pet.category,
          breed: pet.breed,
          location: pet.location,
          price: pet.price,
          description: pet.description,
          age: pet.age,
          owner: pet.owner,
          images: [pet.images[0] || cardImage]
        } 
      } 
    });
  };

  const features = [
    { 
      icon: <FaShieldAlt />,
      title: "Robust ID verification",
      description: "ID verified breeders and buyers to make our site even safer and more transparent."
    },
    {
      icon: <FaCreditCard />,
      title: "Home of Pet Payments",
      description: "Purchase with peace of mind with our Pets4Homes Guarantee"
    },
    {
      icon: <FaUserShield />,
      title: "Trust and safety team",
      description: "A dedicated team to ensure animal welfare and pet safety. We are here to support you and your pet."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const searchVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

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
                      {searchSuggestions.length > 0 && (
                        <SuggestionDropdown>
                          {searchSuggestions.map((item, index) => (
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
                          ))}
                        </SuggestionDropdown>
                      )}
                    </div>
                  
                    <SearchButton onClick={handleSearch}>
                      <FaSearch className="me-2" /> Search
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
              {featuredPets.map((pet) => (
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
                    <img src={pet.images[0]||cardImage} alt={pet.name} />
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

export default Home;