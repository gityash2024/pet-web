import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Modal, Pagination } from 'react-bootstrap';
import { FaUpload, FaPlus, FaEdit, FaTrash, FaExclamationCircle } from 'react-icons/fa';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getAllAdverts, getUserAdverts, createAdvert, updateAdvert, deleteAdvert } from '../contexts/api';
import Loader from '../components/Loader/Loader';
import { toast } from 'react-toastify';

const StyledAddAdvert = styled.div`
  background-color: ${props => props.isDarkMode ? '#1a1a1a' : '#f8f9fa'};
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
  min-height: 100vh;
  padding: 20px 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('https://example.com/pet-background.jpg');
    background-size: cover;
    background-position: center;
    opacity: 0.1;
    z-index: -1;
  }
`;

const GlassmorphicCard = styled(motion.div)`
  background: ${props => props.isDarkMode 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.5);
  }
`;

const StyledButton = styled(Button)`
  background-color: #4CAF50;
  border: none;
  &:hover {
    background-color: #45a049;
  }
`;

const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
`;

// Const data for advertisements
const constAdverts = [
  { id: 1, title: 'Cute Puppy', category: 'Dog', price: 500, location: 'New York', image: 'https://plus.unsplash.com/premium_photo-1664300934715-f7c94c78a566?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWR2ZXJ0aXNlbWVudCUyMHBldHN8ZW58MHx8MHx8fDA%3D' },
  { id: 2, title: 'Persian Cat', category: 'Cat', price: 300, location: 'Los Angeles', image: 'https://plus.unsplash.com/premium_photo-1693028809731-47471835365a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YWR2ZXJ0aXNlbWVudCUyMHBldHN8ZW58MHx8MHx8fDA%3D' },
  { id: 3, title: 'Aquarium Set', category: 'Fish', price: 150, location: 'Chicago', image: 'https://images.unsplash.com/photo-1672006584504-4707b8845c3c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGFkdmVydGlzZW1lbnQlMjBwZXRzfGVufDB8fDB8fHww' },
  // Add more dummy data as needed
];

const NoAdvertsFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
`;

const BigIcon = styled(FaExclamationCircle)`
  font-size: 5rem;
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
  margin-bottom: 1rem;
`;
const userId=JSON.parse(localStorage.getItem('user'))?._id;

const AddAdvert = ({ isDarkMode }) => {
    const [showModal, setShowModal] = useState(false);
    const [adverts, setAdverts] = useState([]);
    const [userAdverts, setUserAdverts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [editingAdvert, setEditingAdvert] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        location: '',
        image: ''
    });
    const [filter, setFilter] = useState({ category: 'all', sort: 'newest' });

    const itemsPerPage = 9;

    useEffect(() => {
        fetchAdverts();
        fetchUserAdverts();
        if (location.state && location.state.tab) {
            setActiveTab(location.state.tab);
        }
    }, []);

    const fetchAdverts = async () => {
        setLoading(true);
        try {
            const response = await getAllAdverts();
            setAdverts(response.data.adverts?.filter(advert => advert.isPublished));
        } catch (error) {
            console.error('Error fetching adverts:', error);
            toast.error('Failed to load adverts');
        }
        setLoading(false);
    };

    const fetchUserAdverts = async () => {
        try {
            const response = await getUserAdverts();
            setUserAdverts(response.data.adverts);
        } catch (error) {
            console.error('Error fetching user adverts:', error);
            toast.error('Failed to load your adverts');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch(
                "https://api.edulley.com/api/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );
            if (!response.ok) {
                throw new Error(`Failed to upload file: ${response.statusText}`);
            }
            const responseData = await response.json();
            const uploadedUrl = responseData.url;
            setFormData(prevState => ({
                ...prevState,
                image: uploadedUrl
            }));
        } catch (error) {
            toast.error(`Error uploading file: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingAdvert) {
                // Create a new object combining existing data with changes
                const updatedAdvertData = {
                    ...editingAdvert,  // Spread all existing advert data
                    ...formData,       // Spread form data (this will overwrite any changed fields)
                    owner: editingAdvert.owner  // Ensure the owner field is preserved
                };
                
                // Remove any fields that shouldn't be sent to the backend
                delete updatedAdvertData._id;  // Assuming _id shouldn't be sent in the update payload
                delete updatedAdvertData.__v;  // Remove version key if it exists
                
                const response = await updateAdvert(editingAdvert._id, updatedAdvertData);
                if (response.status === 200) {
                    toast.success('Advert updated successfully');
                } else {
                    throw new Error(response.message || 'Failed to update advert');
                }
            } else {
                const newAdvertData = {
                    ...formData,
                    owner: userId
                };
                const response = await createAdvert(newAdvertData);
                if (response.status === 201) {
                    toast.success('Advert created successfully');
                } else {
                    throw new Error(response.message || 'Failed to create advert');
                }
            }
            setShowModal(false);
            fetchAdverts();
            fetchUserAdverts();
            resetForm();
        } catch (error) {
            console.error('Error submitting advert:', error);
            toast.error(error.message || 'Failed to submit advert');
        }
        setLoading(false);
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     try {
    //         if (editingAdvert) {
    //             await updateAdvert(editingAdvert._id, formData);
    //             toast.success('Advert updated successfully');
    //         } else {
    //             formData.owner=userId
    //             await createAdvert(formData);
    //             toast.success('Advert created successfully');
    //         }
    //         setShowModal(false);
    //         fetchAdverts();
    //         fetchUserAdverts();
    //         resetForm();
    //     } catch (error) {
    //         console.error('Error submitting advert:', error);
    //         toast.error('Failed to submit advert');
    //     }
    //     setLoading(false);
    // };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this advert?')) {
            setLoading(true);
            try {
                await deleteAdvert(id);
                toast.success('Advert deleted successfully');
                fetchAdverts();
                fetchUserAdverts();
            } catch (error) {
                console.error('Error deleting advert:', error);
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
            image: advert.image
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
            image: ''
        });
        setEditingAdvert(null);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(prevState => ({
            ...prevState,
            [name]: value
        }));
        setCurrentPage(1);
    };

    const displayedAdverts = activeTab === 'user' ? userAdverts.filter(ad => ad.owner === userId)?.filter(advert => advert.isPublished) : adverts;

    const filteredAdverts = displayedAdverts
        .filter(ad => filter.category === 'all' || ad.category === filter.category)
        .sort((a, b) => {
            if (filter.sort === 'priceAsc') return a.price - b.price;
            if (filter.sort === 'priceDesc') return b.price - a.price;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAdverts.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredAdverts.length / itemsPerPage);

    return (
        <StyledAddAdvert isDarkMode={isDarkMode}>
            <Container>
                <Row className="mb-4">
                    <Col>
                        <h1>Advertisements</h1>
                    </Col>
                    <Col xs="auto" className="d-flex align-items-center">
                        <Form.Select
                            name="category"
                            value={filter.category}
                            onChange={handleFilterChange}
                            className="me-2"
                        >
                            <option value="all">All Categories</option>
                            <option value="pet">Pets</option>
                            <option value="accessory">Accessories</option>
                            <option value="service">Services</option>
                        </Form.Select>
                        <Form.Select
                            name="sort"
                            value={filter.sort}
                            onChange={handleFilterChange}
                            className="me-2"
                        >
                            <option value="newest">Newest</option>
                            <option value="priceAsc">Price: Low to High</option>
                            <option value="priceDesc">Price: High to Low</option>
                        </Form.Select>
                        <StyledButton onClick={() => {resetForm(); setShowModal(true);}}>
                            <FaPlus className="me-2" /> Add Advert
                        </StyledButton>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col>
                        <Button 
                            variant={activeTab === 'all' ? 'primary' : 'outline-primary'} 
                            onClick={() => setActiveTab('all')}
                            className="me-2"
                        >
                            All Adverts
                        </Button>
                        <Button 
                            variant={activeTab === 'user' ? 'primary' : 'outline-primary'} 
                            onClick={() => setActiveTab('user')}
                        >
                            My Adverts
                        </Button>
                    </Col>
                </Row>

                {loading ? (
                    <Loader />
                ) : currentItems.length === 0 ? (
                    <NoAdvertsFound>
                        <BigIcon isDarkMode={isDarkMode} />
                        <h2>No Advertisements Found</h2>
                        <p>There are no adverts matching your criteria.</p>
                    </NoAdvertsFound>
                ) : (
                    <>
                        <Row>
                        {currentItems.map(ad => (
    <Col key={ad._id} lg={4} md={6} className="mb-4">
        <GlassmorphicCard 
            isDarkMode={isDarkMode}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
        >
            <Link to={`/ad/${ad._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card.Img variant="top" src={ad.image} style={{ height: '200px', objectFit: 'cover' }} />
                <Card.Body>
                    <Card.Title>{ad.title}</Card.Title>
                    <Card.Text>
                        Category: {ad.category}<br />
                        Price: ${ad.price}<br />
                        Location: {ad.location}
                    </Card.Text>
                </Card.Body>
            </Link>
            {activeTab === 'user' && (
                <div className="mt-2">
                    <Button variant="outline-primary" size="sm" onClick={() => handleEdit(ad)} className="me-2">
                        <FaEdit /> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(ad._id)}>
                        <FaTrash /> Delete
                    </Button>
                </div>
            )}
        </GlassmorphicCard>
    </Col>
))}
                        </Row>

                        {totalPages > 1 && (
                            <Pagination className="justify-content-center">
                                {[...Array(totalPages).keys()].map(number => (
                                    <Pagination.Item 
                                        key={number + 1} 
                                        active={number + 1 === currentPage}
                                        onClick={() => setCurrentPage(number + 1)}
                                    >
                                        {number + 1}
                                    </Pagination.Item>
                                ))}
                            </Pagination>
                        )}
                    </>
                )}
            </Container>

            <Modal show={showModal} onHide={() => {setShowModal(false); resetForm();}} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editingAdvert ? 'Edit Advert' : 'Add New Advert'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

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

                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleImageUpload}
                                accept="image/*"
                            />
                        </Form.Group>

                        <StyledButton type="submit" className="w-100">
                            <FaUpload className="me-2" /> {editingAdvert ? 'Update Advert' : 'Post Advert'}
                        </StyledButton>
                    </Form>
                </Modal.Body>
            </Modal>
        </StyledAddAdvert>
    );
};

AddAdvert.propTypes = {
    isDarkMode: PropTypes.bool.isRequired
};

export default AddAdvert;
