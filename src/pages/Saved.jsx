import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHeart } from 'react-icons/fa';
import { useSavedItems } from '../contexts/SavedItemsContext';

const StyledContainer = styled(Container)`
  padding: 2rem 1rem;
  
  h1 {
    margin-bottom: 2rem;
    color: #0a6638;
  }
  
  .saved-card {
    margin-bottom: 1.5rem;
    transition: transform 0.2s;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    
    &:hover {
      transform: translateY(-5px);
    }
    
    .card-img {
      height: 200px;
      object-fit: cover;
    }
    
    .card-title {
      font-weight: 600;
      color: #0a6638;
    }
    
    .card-price {
      font-weight: 700;
      font-size: 1.2rem;
      color: #0a6638;
    }
    
    .card-footer {
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .btn-remove {
      color: #dc3545;
      border-color: #dc3545;
      
      &:hover {
        background-color: #dc3545;
        color: #fff;
      }
    }
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem;
    
    svg {
      font-size: 3rem;
      color: #ccc;
      margin-bottom: 1rem;
    }
    
    h3 {
      color: #555;
    }
    
    p {
      color: #777;
    }
    
    .btn-browse {
      margin-top: 1rem;
      background-color: #0a6638;
      border-color: #0a6638;
      
      &:hover {
        background-color: #085530;
      }
    }
  }
`;

const Saved = () => {
  const { savedItems, removeSavedItem } = useSavedItems();
  
  return (
    <StyledContainer>
      <h1>Your Saved Items</h1>
      
      {savedItems.length > 0 ? (
        <Row>
          {savedItems.map((item) => (
            <Col key={item.id} xs={12} md={6} lg={4}>
              <Card className="saved-card">
                <Card.Img 
                  variant="top" 
                  src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                  className="card-img" 
                />
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.description.substring(0, 100)}...</Card.Text>
                  <div className="card-price">£{item.price}</div>
                </Card.Body>
                <Card.Footer>
                  <Link to={`/ad/${item.id}`} className="btn btn-outline-primary">View Details</Link>
                  <Button 
                    variant="outline-danger" 
                    className="btn-remove"
                    onClick={() => removeSavedItem(item.id)}
                  >
                    Remove
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="empty-state">
          <FaHeart />
          <h3>No saved items yet</h3>
          <p>Items you save will appear here</p>
          <Link to="/search" className="btn btn-primary btn-browse">
            Browse Pets
          </Link>
        </div>
      )}
    </StyledContainer>
  );
};

export default Saved; 