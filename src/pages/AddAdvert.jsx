import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Modal, Pagination } from 'react-bootstrap';
import { FaUpload, FaPlus, FaEdit, FaTrash, FaExclamationCircle, FaMapMarkerAlt } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { getAllAdverts, getUserAdverts,getAllCategories, createAdvert, updateAdvert, deleteAdvert } from '../contexts/api';
import Loader from '../components/Loader/Loader';
import { toast } from 'react-toastify';
import profileImage from '../assets/profile.png';
import { FaThLarge, FaList, FaCalendar } from 'react-icons/fa';
import { Delete, Edit } from 'lucide-react';
import { uploadFile } from '../utils/fileUpload';

const StyledAddAdvert = styled.div`
  min-height: 100vh;
  padding: 20px 0;
  background-color: ${props => props.isDarkMode ? '#1a1a1a' : '#f8f9fa'};
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
`;

const Header = styled.div`
 background-color: ${props => props.isDarkMode ? '#ffcc00' : '#fff'};
 padding: 20px 0;
 margin-bottom: 30px;
 box-shadow: 0 2px 4px rgba(0,0,0,0.1);
 width: 100%;

 .header-content {
   display: flex;
   justify-content: space-between;
   align-items: center;
   max-width: 1200px;
   margin: 0 auto;
   padding: 0 15px;
 }

 h1 {
   margin: 0;
   color: ${props => props.isDarkMode ? '#fff' : '#333'};
 }
`;

const FilterBar = styled.div`
  background-color: ${props => props.isDarkMode ? '#222' : '#fff'};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
`;

const AdvertCard = styled(motion.div)`
  background: ${props => props.isDarkMode ? '#222' : '#fff'};
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  height: 100%;
  cursor: pointer;

  .card-img-container {
    position: relative;
    padding-top: 66.67%;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0));
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .category-badge {
      background: #fffacc;
      color: #ffcc00;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .action-icons {
      display: flex;
      gap: 10px;

      .icon {
        background: white;
        color: #ffcc00;
        padding: 8px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: scale(1.1);
        }

        &.delete {
          color: #dc3545;
        }
      }
    }
  }

  &:hover img {
    transform: scale(1.1);
  }

  .card-content {
    padding: 20px;

    .card-title {
      font-size: 1.2rem;
      color: ${props => props.isDarkMode ? '#fff' : '#333'};
      margin-bottom: 8px;
    }

    .card-location {
      color: ${props => props.isDarkMode ? '#ccc' : '#666'};
      font-size: 0.9rem;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    }

    .card-description {
      color: ${props => props.isDarkMode ? '#ccc' : '#666'};
      font-size: 0.9rem;
      margin-bottom: 15px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-price {
      font-size: 1.3rem;
      font-weight: bold;
      color: #ffcc00;
    }

    .view-btn {
      border-color: #ffcc00;
      color: #ffcc00;
      
      &:hover {
        background: #ffcc00;
        color: white;
      }
    }
  }
`;

const ListingSection = styled.div`
  margin-bottom: 40px;
`;

const AdvertListing = styled(motion.div)`
  background: ${props => props.isDarkMode ? '#222' : '#fff'};
  border-radius: 15px;
  margin-bottom: 20px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .image-section {
    width: 300px;
    height: 200px;
    position: relative;
    flex-shrink: 0;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.1);
    }

    .featured-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      background: #fffacc;
      color: #ffcc00;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }
  }

  .content-section {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .title {
      font-size: 1.5rem;
      color: ${props => props.isDarkMode ? '#fff' : '#333'};
      margin-bottom: 5px;
    }

    .price {
      font-size: 1.5rem;
      color: #ffcc00;
      font-weight: bold;
    }

    .details {
      display: flex;
      gap: 20px;
      margin-bottom: 15px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 5px;
      color: ${props => props.isDarkMode ? '#ccc' : '#666'};
      font-size: 0.9rem;
    }

    .description {
      color: ${props => props.isDarkMode ? '#ccc' : '#666'};
      margin-bottom: 15px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .actions {
      margin-top: auto;
      display: flex;
      gap: 10px;
    }

    .action-button {
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.3s ease;
      font-weight: 500;

      &.view {
        background: #ffcc00;
        color: white;
        
        &:hover {
          background: #084a29;
        }
      }

      &.edit {
        background: transparent;
        border: 1px solid #ffcc00;
        color: #ffcc00;

        &:hover {
          background: #0a663810;
        }
      }

      &.delete {
        background: transparent;
        border: 1px solid #dc3545;
        color: #dc3545;

        &:hover {
          background: #dc354510;
        }
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;

    .image-section {
      width: 100%;
    }
  }
`;
const ActionButtons = styled.div`
  margin-top: 15px;
  display: flex;
  gap: 10px;

  button {
    flex: 1;
    background-color: #ffcc00;
    border-color: #ffcc00;
    
    &:hover {
      background-color: #084a29;
      border-color: #084a29;
    }
  }
`;

const AddButton = styled(Button)`
  background-color: #ffcc00;
  border-color: #ffcc00;
  
  &:hover {
    background-color: #084a29;
    border-color: #084a29;
  }
`;

const NoAdvertsFound = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: ${props => props.isDarkMode ? '#222' : '#fff'};
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const userId = JSON.parse(localStorage.getItem('user'))?._id;

const AddAdvert = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const [adverts, setAdverts] = useState([]);
  const [userAdverts, setUserAdverts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [categories,setCategories]= useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAdvert, setEditingAdvert] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    breed: '',
    age: '',
    ageUnit: 'weeks',
    gender: '',
    healthStatus: '',
    vaccinationDetails: {
      firstVaccination: false,
      deworming: false,
      boosters: false
    },
    vaccinationCertificates: [],
    vetHealthCertificate: '',
    microchipId: '',
  });
  const [filter, setFilter] = useState({ category: 'all', sort: 'newest' });

  const itemsPerPage = 9;

  useEffect(() => {
    fetchAdverts();
    fetchUserAdverts();
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
  },[])

  const fetchAdverts = async () => {
    setLoading(true);
    try {
      const response = await getAllAdverts();
      setAdverts(response.data.adverts?.filter(advert => advert.isPublished) || []);
    } catch (error) {
      console.error('Error fetching adverts:', error);
      toast.error('Failed to load adverts');
    }
    setLoading(false);
  };

  const fetchUserAdverts = async () => {
    try {
      const response = await getUserAdverts();
      setUserAdverts(response.data.adverts || []);
    } catch (error) {
      console.error('Error fetching user adverts:', error);
      toast.error('Failed to load your adverts');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      vaccinationDetails: {
        ...formData.vaccinationDetails,
        [name]: checked
      }
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    try {
      setLoading(true);
      const result = await uploadFile(file, localStorage.getItem('token'));
      setFormData(prevState => ({
        ...prevState,
        image: result.fileUrl
      }));
    } catch (error) {
      // Error is already handled in the uploadFile function
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.breed) {
      toast.error('Species/Breed is required');
      return;
    }
    
    if (!formData.age) {
      toast.error('Age is required');
      return;
    }
    
    if (!formData.gender) {
      toast.error('Sex is required');
      return;
    }
    
    if (!formData.healthStatus) {
      toast.error('Health status is required');
      return;
    }
    
    // Validate minimum age for dogs
    if (formData.category.toLowerCase() === 'dog' && formData.age) {
      const ageValue = parseInt(formData.age);
      const ageUnit = formData.ageUnit || 'weeks';
      
      if (ageUnit === 'weeks' && ageValue < 8) {
        toast.error('Dogs must be at least 8 weeks old');
        return;
      } else if (ageUnit === 'months' && ageValue < 2) {
        toast.error('Dogs must be at least 2 months old');
        return;
      }
    }
    
    setLoading(true);
    try {
      // Handle file uploads for certificates if they are File objects
      let processedData = { ...formData };
      
      // Process vaccination certificates if they are File objects
      if (formData.vaccinationCertificates && formData.vaccinationCertificates.length > 0 && 
          formData.vaccinationCertificates[0] instanceof File) {
        const certificateUrls = [];
        for (const file of formData.vaccinationCertificates) {
          const result = await uploadFile(file, localStorage.getItem('token'));
          certificateUrls.push(result.fileUrl);
        }
        processedData.vaccinationCertificates = certificateUrls;
      }
      
      // Process vet health certificate if it's a File object
      if (formData.vetHealthCertificate && formData.vetHealthCertificate instanceof File) {
        const result = await uploadFile(formData.vetHealthCertificate, localStorage.getItem('token'));
        processedData.vetHealthCertificate = result.fileUrl;
      }
      
      const submitData = {
        ...processedData,
        owner: userId
      };

      if (editingAdvert) {
        await updateAdvert(editingAdvert._id, submitData);
        toast.success('Advert updated successfully');
      } else {
        await createAdvert(submitData);
        toast.success('Advert created successfully');
      }
      
      setShowModal(false);
      fetchAdverts();
      fetchUserAdverts();
      resetForm();
    } catch (error) {
      toast.error(error.message || 'Failed to submit advert');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this advert?')) {
      setLoading(true);
      try {
        await deleteAdvert(id);
        toast.success('Advert deleted successfully');
        fetchAdverts();
        fetchUserAdverts();
      } catch (error) {
        toast.error('Failed to delete advert');
      }
      setLoading(false);
    }
  };

  const handleEdit = (advert) => {
    setEditingAdvert(advert);
    setFormData({
      title: advert.title,
      description: advert.description,
      price: advert.price,
      category: advert.category,
      location: advert.location,
      image: advert.image,
      // Pet Information fields
      breed: advert.breed || '',
      age: advert.age || '',
      ageUnit: advert.ageUnit || 'weeks',
      gender: advert.gender || '',
      healthStatus: advert.healthStatus || '',
      vaccinationDetails: advert.vaccinationDetails || {
        firstVaccination: false,
        deworming: false,
        boosters: false
      },
      vaccinationCertificates: advert.vaccinationCertificates || [],
      vetHealthCertificate: advert.vetHealthCertificate || '',
      microchipId: advert.microchipId || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      location: '',
      breed: '',
      age: '',
      ageUnit: 'weeks',
      gender: '',
      healthStatus: '',
      vaccinationDetails: {
        firstVaccination: false,
        deworming: false,
        boosters: false
      },
      vaccinationCertificates: [],
      vetHealthCertificate: '',
      microchipId: '',
    });
    setEditingAdvert(null);
  };
  const handleViewDetails = (item) => {
    navigate(`/ad/${item._id}`, { 
      state: { 
        advert: {
          ...item,
          name: item.title,
          breed: item.breed || item.category,
          age: item.age || '',
          ageUnit: item.ageUnit || 'weeks',
          gender: item.gender || '',
          healthStatus: item.healthStatus || '',
          vaccinationDetails: item.vaccinationDetails || {
            firstVaccination: false,
            deworming: false,
            boosters: false
          },
          vaccinationCertificates: item.vaccinationCertificates || [],
          vetHealthCertificate: item.vetHealthCertificate || '',
          microchipId: item.microchipId || '',
          images: [item.image || profileImage]
        } 
      } 
    });
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prevState => ({
      ...prevState,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const displayedAdverts = activeTab === 'user' 
    ? userAdverts.filter(ad => ad.owner === userId)
    : adverts;

  const filteredAdverts = displayedAdverts
    .filter(ad => filter.category === 'all' || ad.category === filter.category)
    .sort((a, b) => {
      if (filter.sort === 'priceAsc') return a.price - b.price;
      if (filter.sort === 'priceDesc') return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const currentItems = filteredAdverts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAdverts.length / itemsPerPage);

  return (
    <StyledAddAdvert isDarkMode={isDarkMode}>
   <Header isDarkMode={isDarkMode}>
 <div className="header-content">
   <h1>Advertisements</h1>
   <AddButton onClick={() => {resetForm(); setShowModal(true);}}>
     <FaPlus className="me-2" /> Add Advert
   </AddButton>
 </div>
</Header>

      <Container>
        <FilterBar isDarkMode={isDarkMode}>
          <Row className="align-items-center">
            <Col md={4}>
              <Button 
                variant={activeTab === 'all' ? 'success' : 'outline-success'} 
                onClick={() => setActiveTab('all')}
                className="me-2"
              >
                All Adverts
              </Button>
              <Button 
                variant={activeTab === 'user' ? 'success' : 'outline-success'} 
                onClick={() => setActiveTab('user')}
              >
                My Adverts
              </Button>
            </Col>
            <Col md={4}>
              <Form.Select
                name="category"
                value={filter.category}
                onChange={handleFilterChange}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select
                name="sort"
                value={filter.sort}
                onChange={handleFilterChange}
              >
                <option value="newest">Newest First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </Form.Select>
            </Col>
          </Row>
        </FilterBar>

        {loading ? (
  <Loader />
) : currentItems.length === 0 ? (
  <NoAdvertsFound isDarkMode={isDarkMode}>
    <FaExclamationCircle size={50} className="mb-3" />
    <h3>No Advertisements Found</h3>
    <p>There are no adverts matching your criteria.</p>
  </NoAdvertsFound>
) : (
  <>
    <div className="d-flex justify-content-end mb-3">
      <Button 
        variant={viewMode === 'grid' ? 'success' : 'outline-success'} 
        className="me-2"
        onClick={() => setViewMode('grid')}
      >
        <FaThLarge className="me-1" /> Grid
      </Button>
      <Button 
        variant={viewMode === 'list' ? 'success' : 'outline-success'}
        onClick={() => setViewMode('list')}
      >
        <FaList className="me-1" /> List
      </Button>
    </div>

    {viewMode === 'grid' ? (
      <Row>
        {currentItems.map(ad => (
          <Col key={ad._id} lg={4} md={6} className="mb-4">
            <AdvertCard
              isDarkMode={isDarkMode}
              whileHover={{ y: -5 }}
              onClick={() => handleViewDetails(ad)}
            >
              <div className="card-img-container">
                <img src={ad.image || profileImage} alt={ad.title} />
                <div className="card-overlay">
                  <span className="category-badge">
                    {ad.category}
                  </span>
                  {activeTab === 'user' && (
                    <div className="action-icons">
                      <Edit 
                        className="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(ad);
                        }}
                      />
                      <Delete 
                        className="icon delete" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ad._id);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="card-content">
                <h4 className="card-title">{ad.title}</h4>
                <p className="card-location">
                  <FaMapMarkerAlt className="me-1" />
                  {ad.location}
                </p>
                <p className="card-description">{ad.description}</p>
                <div className="card-footer">
                  <span className="card-price">₹ {ad.price}</span>
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    className="view-btn"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </AdvertCard>
          </Col>
        ))}
      </Row>
    ) : (
      <ListingSection>
        {currentItems.map(ad => (
          <AdvertListing
            key={ad._id}
            isDarkMode={isDarkMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => handleViewDetails(ad)}
          >
            <div className="image-section">
              <img src={ad.image || profileImage} alt={ad.title} />
              <span className="featured-badge">{ad.category}</span>
            </div>
            <div className="content-section">
              <div className="header">
                <div>
                  <h3 className="title">{ad.title}</h3>
                  <div className="details">
                    <span className="detail-item">
                      <FaMapMarkerAlt /> {ad.location}
                    </span>
                    <span className="detail-item">
                      <FaCalendar /> {new Date(ad.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="price">₹ {ad.price}</div>
              </div>
              <p className="description">{ad.description}</p>
              <div className="actions">
                <button className="action-button view">
                  View Details
                </button>
                {activeTab === 'user' && (
                  <>
                    <button 
                      className="action-button edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(ad);
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(ad._id);
                      }}
                    >
                      <FaTrash /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </AdvertListing>
        ))}
      </ListingSection>
    )}

    {totalPages > 1 && (
      <Pagination className="justify-content-center mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    )}
  </>
)}
        <Modal 
          show={showModal} 
          onHide={() => {setShowModal(false); resetForm();}}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingAdvert ? 'Edit Advert' : 'Add New Advert'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form onSubmit={handleSubmit} className="p-3">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter advert title"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="pet">Pet</option>
                      <option value="accessory">Accessory</option>
                      <option value="service">Service</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      placeholder="Enter price"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      placeholder="Enter location"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Enter detailed description"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-2"
                    style={{ maxWidth: '200px', borderRadius: '8px' }}
                  />
                )}
              </Form.Group>

              {/* Pet Information Section */}
              <div className="mb-4">
                <h4>Pet Information</h4>
                <hr />
                
                <Form.Group className="mb-3">
                  <Form.Label>Species/Breed*</Form.Label>
                  <Form.Control
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    placeholder="e.g., French Bulldog"
                    required
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Age*</Form.Label>
                      <Row>
                        <Col xs={6}>
                          <Form.Control
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Age"
                            min={formData.category.toLowerCase() === 'dog' ? 8 : 0}
                            required
                          />
                        </Col>
                        <Col xs={6}>
                          <Form.Select
                            style={{marginTop: '10px'}}
                            name="ageUnit"
                            value={formData.ageUnit}
                            onChange={handleChange}
                            required
                          >
                            <option value="weeks">Weeks</option>
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                          </Form.Select>
                        </Col>
                      </Row>
                      {formData.category.toLowerCase() === 'dog' && (
                        <Form.Text className="text-muted">
                          Minimum age for dogs is 8 weeks
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Sex*</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="mixed">Mixed (for multiple pets)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Health Status*</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="healthStatus"
                    value={formData.healthStatus}
                    onChange={handleChange}
                    placeholder="Describe the pet's health status"
                    rows={3}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Vaccination Details</Form.Label>
                  <div className="d-flex flex-column">
                    <Form.Check
                      type="checkbox"
                      label="First vaccination"
                      name="firstVaccination"
                      checked={formData.vaccinationDetails.firstVaccination}
                      onChange={handleCheckboxChange}
                      className="mb-2"
                    />
                    <Form.Check
                      type="checkbox"
                      label="Deworming"
                      name="deworming"
                      checked={formData.vaccinationDetails.deworming}
                      onChange={handleCheckboxChange}
                      className="mb-2"
                    />
                    <Form.Check
                      type="checkbox"
                      label="Boosters"
                      name="boosters"
                      checked={formData.vaccinationDetails.boosters}
                      onChange={handleCheckboxChange}
                      className="mb-2"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Vaccination Certificates</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setFormData({
                        ...formData,
                        vaccinationCertificates: files
                      });
                    }}
                  />
                  <Form.Text className="text-muted">
                    Upload images or PDFs of vaccination certificates
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Veterinary Health Certificate</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        vetHealthCertificate: e.target.files[0]
                      });
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Microchip/Tag ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="microchipId"
                    value={formData.microchipId}
                    onChange={handleChange}
                    placeholder="Enter microchip or tag ID if available"
                  />
                </Form.Group>
              </div>
              
              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-secondary"
                  onClick={() => {setShowModal(false); resetForm();}}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button
                  variant="success"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingAdvert ? 'Update' : 'Create')} Advert
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </StyledAddAdvert>
  );
};

AddAdvert.propTypes = {
  isDarkMode: PropTypes.bool.isRequired
};

export default AddAdvert;