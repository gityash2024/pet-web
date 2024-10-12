import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, Badge, Image, Dropdown } from 'react-bootstrap';
import { FaPaperPlane, FaUser, FaCopy, FaReply, FaEllipsisV, FaInbox } from 'react-icons/fa';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { getUserMessages, sendMessage, markMessageAsRead } from '../contexts/api';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const StyledMessages = styled.div`
  background-color: ${props => props.isDarkMode ? '#1a1a1a' : '#f8f9fa'};
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
  min-height: 100vh;
  padding: 80px 40px;
`;

const MessengerContainer = styled.div`
  background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const ContactList = styled(ListGroup)`
  height: 70vh;
  overflow-y: auto;
  border-right: 1px solid ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    border-radius: 3px;
  }
`;

const ContactItem = styled(ListGroup.Item)`
  background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 15px;
  border-bottom: 1px solid ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};

  &:hover {
    background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    transform: translateY(-2px);
  }

  ${props => props.active && `
    background: ${props.isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'} !important;
  `}
`;

const MessageArea = styled.div`
  height: 70vh;
  display: flex;
  flex-direction: column;
`;

const MessageList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    border-radius: 3px;
  }
`;

const Message = styled(motion.div)`
  max-width: 70%;
  padding: 12px 18px;
  border-radius: 20px;
  margin-bottom: 15px;
  word-wrap: break-word;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  align-self: ${props => props.sent ? 'flex-end' : 'flex-start'};

  ${props => props.sent ? `
    background-color: #4CAF50;
    color: white;
    border-bottom-right-radius: 0;
  ` : `
    background-color: ${props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    border-bottom-left-radius: 0;
  `}
`;

const MessageActions = styled(Dropdown)`
  position: absolute;
  top: 5px;
  right: 5px;
`;

const StyledForm = styled(Form)`
  background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'};
  padding: 20px;
  border-top: 1px solid ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  display: flex;
  align-items: center;
`;

const StyledButton = styled(Button)`
  background-color: #4CAF50;
  border: none;
  padding: 10px 20px;
  transition: all 0.3s ease;
  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }
`;

const SearchBox = styled(Form.Control)`
  background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'};
  border: 1px solid ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  color: ${props => props.isDarkMode ? '#fff' : '#333'};
  &::placeholder {
    color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
  }
`;

const UserAvatar = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
`;

const ArticleDetails = styled.div`
  background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Messages = ({ isDarkMode }) => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const messageListRef = useRef(null);
    const location = useLocation();
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchUserMessages();
        if (location.state && location.state.conversationId) {
            handleConversationSelect(location.state.conversationId);
        }
        const intervalId = setInterval(fetchUserMessages, 5000); // Poll every 5 seconds
        return () => clearInterval(intervalId);
    }, [location]);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchUserMessages = async () => {
        try {
            const response = await getUserMessages();
            const groupedConversations = response.data.messages.reduce((acc, message) => {
                const otherUser = message.sender._id === currentUser._id ? message.recipient : message.sender;
                if (otherUser._id === currentUser._id) return acc; // Skip self-messages
                const key = `${otherUser._id}-${message.advert._id}`;
                if (!acc[key]) {
                    acc[key] = {
                        _id: key,
                        otherUser,
                        advert: message.advert,
                        lastMessage: message,
                        unreadCount: message.read || message.sender._id === currentUser._id ? 0 : 1,
                        messages: [message]
                    };
                } else {
                    acc[key].lastMessage = message;
                    acc[key].messages.push(message);
                    if (!message.read && message.sender._id !== currentUser._id) {
                        acc[key].unreadCount += 1;
                    }
                }
                return acc;
            }, {});
            setConversations(Object.values(groupedConversations));
            
            // Update messages if a conversation is selected
            if (selectedConversation) {
                const updatedConversation = Object.values(groupedConversations).find(c => c._id === selectedConversation._id);
                if (updatedConversation) {
                    setMessages(updatedConversation.messages);
                    setSelectedConversation(updatedConversation);
                }
            }
        } catch (error) {
            console.error('Error fetching user messages:', error);
            toast.error('Failed to fetch messages');
        }
    };

    const handleConversationSelect = (conversationId) => {
        const conversation = conversations.find(c => c._id === conversationId);
        setSelectedConversation(conversation);
        setMessages(conversation?.messages || []);
        conversation?.messages.forEach(message => {
            if (!message?.read && message?.sender?._id !== currentUser?._id) {
                markMessageAsRead(message?._id);
            }
        });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() && selectedConversation) {
            try {
                const messageData = {
                    advertId: selectedConversation.advert._id,
                    recipientId: selectedConversation.otherUser._id,
                    content: newMessage.trim()
                };
                const response = await sendMessage(messageData);
                const sentMessage = {
                    ...response.data.message,
                    sender: { _id: currentUser._id, name: currentUser.name },
                    recipient: selectedConversation.otherUser
                };
                setMessages(prevMessages => [...prevMessages, sentMessage]);
                setNewMessage('');
                // Update the conversation list
                setConversations(prevConversations => {
                    const updatedConversations = [...prevConversations];
                    const index = updatedConversations.findIndex(c => c._id === selectedConversation._id);
                    if (index !== -1) {
                        updatedConversations[index] = {
                            ...updatedConversations[index],
                            lastMessage: sentMessage,
                            messages: [...updatedConversations[index].messages, sentMessage]
                        };
                    }
                    return updatedConversations;
                });
            } catch (error) {
                console.error('Error sending message:', error);
                toast.error('Failed to send message');
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    const handleCopyMessage = (content) => {
        navigator.clipboard.writeText(content);
        toast.success('Message copied to clipboard');
    };

    const handleReplyMessage = (content) => {
        setNewMessage(`Reply to: "${content.substring(0, 30)}..."\n\n`);
    };

    const filteredConversations = conversations.filter(conversation =>
        conversation.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversation.advert.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const capitalizeFirstLetter = (string) => {
        return string?.charAt(0)?.toUpperCase() + string?.slice(1);
    };

    return (
        <StyledMessages isDarkMode={isDarkMode}>
            <Container fluid>
                <h1 className="text-center mb-4">Messages</h1>
                <MessengerContainer isDarkMode={isDarkMode}>
                    <Row>
                        <Col md={4} className="p-0">
                            <div className="p-3">
                                <SearchBox
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    isDarkMode={isDarkMode}
                                />
                            </div>
                            <ContactList isDarkMode={isDarkMode}>
                                {filteredConversations.map(conversation => (
                                    <ContactItem
                                        key={conversation._id}
                                        active={selectedConversation && selectedConversation._id === conversation._id}
                                        onClick={() => handleConversationSelect(conversation._id)}
                                        isDarkMode={isDarkMode}
                                    >
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <UserAvatar src={`https://i.pravatar.cc/150?u=${conversation.otherUser._id}`} alt={conversation.otherUser.name} />
                                                <div>
                                                    <h6 className="mb-0">{capitalizeFirstLetter(conversation.otherUser.name)}</h6>
                                                    <small className="text-muted">{conversation.advert.title}</small>
                                                </div>
                                            </div>
                                            <div>
                                                <Badge bg="primary">{conversation.messages.length}</Badge>
                                                {conversation.unreadCount > 0 && (
                                                    <Badge bg="danger" className="ml-2">{conversation.unreadCount}</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </ContactItem>
                                ))}
                            </ContactList>
                        </Col>
                        <Col md={8} className="p-0">
                            <MessageArea>
                                {selectedConversation ? (
                                    <>
                                        <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                            <UserAvatar src={`https://i.pravatar.cc/150?u=${selectedConversation.otherUser._id}`} alt={selectedConversation.otherUser.name} />
                                                <div>
                                                    <h5 className="mb-0">{capitalizeFirstLetter(selectedConversation.otherUser.name)}</h5>
                                                    <small>{selectedConversation.advert.title}</small>
                                                </div>
                                            </div>
                                            <Badge bg="primary">{messages.length} messages</Badge>
                                        </div>
                                        <MessageList ref={messageListRef} isDarkMode={isDarkMode}>
                                            <ArticleDetails isDarkMode={isDarkMode}>
                                                <h6>Article: {selectedConversation.advert.title}</h6>
                                            </ArticleDetails>
                                            <AnimatePresence>
                                                {messages.length > 0 ? messages.map(message => (
                                                    <Message
                                                        key={message._id}
                                                        sent={message.sender._id === currentUser._id}
                                                        isDarkMode={isDarkMode}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                    >
                                                        <strong>{capitalizeFirstLetter(message.sender._id === currentUser._id ? currentUser.name : selectedConversation.otherUser.name)}</strong>
                                                        <p>{message.content}</p>
                                                        <div>
                                                            <small>{new Date(message.createdAt).toLocaleTimeString()}</small>
                                                        </div>
                                                        <MessageActions>
                                                            <Dropdown.Toggle variant="link" size="sm">
                                                                <FaEllipsisV />
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item onClick={() => handleCopyMessage(message.content)}>
                                                                    <FaCopy /> Copy
                                                                </Dropdown.Item>
                                                                <Dropdown.Item onClick={() => handleReplyMessage(message.content)}>
                                                                    <FaReply /> Reply
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </MessageActions>
                                                    </Message>
                                                )) : (
                                                    <div className="text-center mt-5">
                                                        <FaInbox size={50} />
                                                        <p>No messages found</p>
                                                    </div>
                                                )}
                                            </AnimatePresence>
                                        </MessageList>
                                        <StyledForm onSubmit={handleSendMessage} isDarkMode={isDarkMode}>
                                            <Row className="w-100 m-0 align-items-center">
                                                <Col className="p-0">
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={1}
                                                        placeholder="Type a message..."
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                    />
                                                </Col>
                                                <Col xs="auto" className="p-0 pl-2">
                                                    <StyledButton type="submit">
                                                        <FaPaperPlane /> Send
                                                    </StyledButton>
                                                </Col>
                                            </Row>
                                        </StyledForm>
                                    </>
                                ) : (
                                    <div className="h-100 d-flex justify-content-center align-items-center">
                                        <h4>Select a conversation to start messaging</h4>
                                    </div>
                                )}
                            </MessageArea>
                        </Col>
                    </Row>
                </MessengerContainer>
            </Container>
        </StyledMessages>
    );
};

Messages.propTypes = {
    isDarkMode: PropTypes.bool.isRequired
};

export default Messages;
