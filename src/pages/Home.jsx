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
    border-color: #ffcc00;
  }
`;

const FilterButton = styled.button`
  background: none;
  border: none;
  color: #ffcc00;
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
  background-color: ${props => props.active ? '#ffcc00' : '#fff'};
  color: ${props => props.active ? '#fff' : '#333'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
  }
  
  &:hover {
    border-color: #ffcc00;
    color: ${props => props.active ? '#fff' : '#ffcc00'};
  }
`;

const ChooseCategoryButton = styled(CategoryButton)`
  background-color: #ffcc00;
  color: #fff;
  border-color: #ffcc00;
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
    background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
    background-size: 200% 100%;
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  .content {
    padding: 20px;
  }
  
  @keyframes pulse {
    0% { background-position: 0% 0%; }
    100% { background-position: -200% 0%; }
  }
`;

const SafetyIllustration = () => (
    <svg width="200" height="200" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M150 50C150 50 60 82 60 178C60 274 150 274 150 274C150 274 240 274 240 178C240 82 150 50 150 50Z" 
        fill="var(--primary)"
      />
      <path 
        d="M120 180C120 180 140 200 150 200C160 200 180 180 180 180C180 180 160 220 150 220C140 220 120 180 120 180Z" 
        fill="var(--secondary)"
      />
      <circle cx="150" cy="140" r="40" fill="var(--secondary)"/>
      <path 
        d="M130 140L145 155L175 125" 
        stroke="var(--primary)" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
  
const HeroSection = styled.section`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #fff;
  padding: 80px 0 60px;
  position: relative;
  overflow: hidden;
  // margin-top: 76px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(251, 194, 31, 0.2) 0%, transparent 70%);
    pointer-events: none;
  }
  
  h1 {
    font-weight: 700;
    margin-bottom: 1.5rem;
    font-size: 2.8rem;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
    color: #ffffff;
    
    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 1;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    color: var(--secondary-lighter);
    font-weight: 500;
  }
`;

const SearchSection = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  position: relative;
  border: 1px solid rgba(251, 194, 31, 0.2);
  
  h2 {
    color: var(--primary-dark);
    font-weight: 600;
    margin-bottom: 1.2rem;
    font-size: 1.5rem;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 50px;
      height: 3px;
      background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
    }
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px;
  border: 1px solid rgba(192, 49, 21, 0.2);
  border-radius: 8px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(192, 49, 21, 0.2);
  }
`;

const SearchButton = styled(Button)`
  width: 100%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  color: #ffffff;
  
  &:hover {
    background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(192, 49, 21, 0.3);
    color: #ffffff;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const SuggestionDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid rgba(192, 49, 21, 0.2);
  border-top: none;
  border-radius: 0 0 10px 10px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
`;

const SuggestionItem = styled.div`
  padding: 12px 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(251, 194, 31, 0.1);
    color: var(--primary);
  }
`;

const SafetyCard = styled.div`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  padding: 40px;
  border-radius: 15px;
  margin: 60px 0;
  position: relative;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(251, 194, 31, 0.15) 0%, transparent 70%);
    pointer-events: none;
  }
  
  h2 {
    color: #ffffff;
    font-weight: 700;
    margin-bottom: 1.5rem;
    position: relative;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, var(--secondary) 0%, var(--secondary-light) 100%);
    }
  }
  
  p {
    color: var(--secondary-lighter);
    font-size: 1.05rem;
    margin-bottom: 1.5rem;
    opacity: 0.95;
  }
  
  .btn-success {
    background: linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%);
    border: none;
    color: var(--primary-dark);
    font-weight: 600;
    padding: 0.6rem 1.2rem;
    
    &:hover {
      background: linear-gradient(135deg, var(--secondary-light) 0%, var(--secondary) 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  }
  
  .btn-warning {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid var(--secondary-light);
    color: var(--secondary-lighter);
    font-weight: 500;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      color: #ffffff;
      transform: translateY(-2px);
    }
  }
`;

const PetCard = styled(motion.div)`
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(0,0,0,0.12);
  }
  
  img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-bottom: 1px solid rgba(251, 194, 31, 0.2);
  }
  
  .content {
    padding: 20px;
    
    h5 {
      color: var(--primary-dark);
      font-weight: 600;
      margin-bottom: 10px;
    }
    
    p {
      color: var(--text-dark);
      margin-bottom: 15px;
    }
    
    .price {
      font-weight: 700;
      color: var(--primary);
      font-size: 1.2rem;
      margin-bottom: 15px;
    }
    
    .location {
      color: #666;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      
      svg {
        margin-right: 5px;
      }
    }
  }
`;

const FeatureBox = styled(motion.div)`
  text-align: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  margin: 20px 0;
  border: 1px solid rgba(251, 194, 31, 0.2);
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(0,0,0,0.12);
    border-color: rgba(192, 49, 21, 0.2);
  }
  
  svg {
    color: var(--primary);
    font-size: 2.5rem;
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(192, 49, 21, 0.05) 0%, rgba(192, 49, 21, 0.15) 100%);
  }
  
  h3 {
    color: var(--primary-dark);
    font-weight: 600;
    margin-bottom: 15px;
    font-size: 1.3rem;
  }
  
  p {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.6;
  }
`;

const NoDataSVG = () => (
  <svg width="120" height="120" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="120" cy="120" r="80" fill="#f5f5f5"/>
    <path d="M160 100c0 22.1-17.9 40-40 40s-40-17.9-40-40 17.9-40 40-40 40 17.9 40 40z" stroke="var(--primary)" strokeWidth="8"/>
    <path d="M170 170l-25-25" stroke="var(--primary)" strokeWidth="8" strokeLinecap="round"/>
    <path d="M120 80v40M100 100h40" stroke="var(--primary)" strokeWidth="8" strokeLinecap="round"/>
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
          name: pet.name,
          breed: pet.breed || pet.category,
          age: pet.age || '',
          ageUnit: pet.ageUnit || 'weeks',
          gender: pet.gender || '',
          healthStatus: pet.healthStatus || '',
          vaccinationDetails: pet.vaccinationDetails || {
            firstVaccination: false,
            deworming: false,
            boosters: false
          },
          vaccinationCertificates: pet.vaccinationCertificates || [],
          vetHealthCertificate: pet.vetHealthCertificate || '',
          microchipId: pet.microchipId || '',
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
                                  <strong style={{color: '#ffcc00'}}>{item.name}</strong>
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