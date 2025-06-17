import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, IconButton, Avatar, Badge } from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';
import styled from 'styled-components';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplyIcon from '@mui/icons-material/Reply';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { getUserMessages, sendMessage, markMessageAsRead } from '../contexts/api';
import { toast } from 'react-toastify';
import { useMediaQuery } from '@mui/material';

const MainContainer = styled(Box)`
  background: linear-gradient(135deg, #f8f8f8 0%, var(--background-highlight) 100%);
  min-height: 100vh;
  padding: 16px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(251, 194, 31, 0.15) 0%, transparent 70%),
                radial-gradient(circle at bottom left, rgba(192, 49, 21, 0.08) 0%, transparent 70%);
    z-index: 0;
    pointer-events: none;
  }
  
  @media (max-width: 600px) {
    padding: 8px;
  }
`;

const ContentWrapper = styled(Box)`
  position: relative;
  z-index: 1;
`;

const MessagesContainer = muiStyled(Paper)(({ theme }) => ({
  display: 'flex',
  height: 'calc(100vh - 100px)',
  overflow: 'hidden',
  borderRadius: '15px',
  backgroundColor: '#fff',
  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  border: '1px solid rgba(251, 194, 31, 0.2)',
}));

const ConversationsList = muiStyled(Box)(({ theme }) => ({
  width: '30%',
  borderRight: '1px solid rgba(251, 194, 31, 0.2)',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  }
}));

const ConversationHeader = muiStyled(Box)(({ theme }) => ({
  padding: '15px 16px',
  background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
  borderBottom: '1px solid rgba(251, 194, 31, 0.2)',
}));

const ConversationItem = muiStyled(Box, {
  shouldForwardProp: (prop) => prop !== 'selected',
})(({ selected, theme }) => ({
  padding: '15px 16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: selected ? 'rgba(251, 194, 31, 0.1)' : '#fff',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(251, 194, 31, 0.05)'
  },
  borderBottom: '1px solid rgba(251, 194, 31, 0.2)'
}));

const ChatArea = muiStyled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f5f5f5',
  backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
  backgroundSize: 'contain',
  position: 'relative',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 0
  }
}));

const ChatHeader = muiStyled(Box)(({ theme }) => ({
  padding: '15px 20px',
  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
  color: '#ffffff',
  borderBottom: '1px solid rgba(251, 194, 31, 0.2)',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  zIndex: 1
}));

const MessagesArea = muiStyled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: '20px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  position: 'relative',
  zIndex: 1
}));

const MessageBubble = muiStyled(Box, {
  shouldForwardProp: (prop) => prop !== 'sent',
})(({ sent, theme }) => ({
  maxWidth: '65%',
  padding: '12px 16px',
  borderRadius: sent ? '15px 0 15px 15px' : '0 15px 15px 15px',
  alignSelf: sent ? 'flex-end' : 'flex-start',
  backgroundColor: sent ? 'rgba(192, 49, 21, 0.1)' : '#fff',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  position: 'relative',
  marginBottom: '4px',
  border: sent ? '1px solid rgba(192, 49, 21, 0.2)' : '1px solid rgba(251, 194, 31, 0.2)'
}));

const InputArea = muiStyled(Box)(({ theme }) => ({
  padding: '15px 20px',
  background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
  borderTop: '1px solid rgba(251, 194, 31, 0.2)',
  position: 'relative',
  zIndex: 1
}));

const SearchField = muiStyled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    borderRadius: '8px',
    '& fieldset': {
      border: '1px solid rgba(192, 49, 21, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'var(--primary)'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--primary)',
      borderWidth: '1px'
    }
  }
}));

const SendButton = muiStyled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
  color: '#fff',
  height: '100%',
  minWidth: '50px',
  borderRadius: '8px',
  '&:hover': {
    background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(192, 49, 21, 0.3)'
  },
  '&.Mui-disabled': {
    background: '#e0e0e0',
    color: '#a0a0a0'
  }
}));

const MessageInput = muiStyled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    borderRadius: '8px',
    '& fieldset': {
      border: '1px solid rgba(192, 49, 21, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'var(--primary)'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--primary)',
      borderWidth: '1px'
    }
  }
}));

const StyledBadge = muiStyled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: 'var(--primary)',
    color: '#fff',
    fontWeight: 'bold'
  }
}));

const StyledAvatar = muiStyled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  border: '2px solid #fff',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
}));

const Messages = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [showConversations, setShowConversations] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesAreaRef = useRef(null);
  const isLoggedIn = localStorage.getItem('token');
  const currentUser = isLoggedIn ? JSON.parse(localStorage.getItem('user')) : null;
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please login to view messages');
      // Note: Navigation would be handled by the BottomNav component
      return;
    }
  }, [isLoggedIn]);

  // If not logged in, show a message instead of the full component
  if (!isLoggedIn) {
    return (
      <MainContainer>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="calc(100vh - 140px)"
          sx={{ backgroundColor: '#f0f2f5' }}
        >
          <Typography variant="h6" color="textSecondary">
            Please login to view your messages
          </Typography>
        </Box>
      </MainContainer>
    );
  }

  useEffect(() => {
    let interval;
  
    const startPolling = async () => {
      await fetchMessages();
      interval = setInterval(async () => {
        if (messagesAreaRef.current) {
          setLastScrollPosition(messagesAreaRef.current.scrollTop);
        }
        await fetchMessages();
      }, 5000);
    };
  
    startPolling();
  
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [selectedConversation?._id]); // Add dependency to re-establish polling when conversation changes

  useEffect(() => {
    if (messagesAreaRef.current && lastScrollPosition) {
      messagesAreaRef.current.scrollTop = lastScrollPosition;
    }
  }, [messages]);

  const fetchMessages = async () => {
    if (!isLoggedIn) {
      // Don't try to fetch if not logged in
      return;
    }
    
    try {
      const response = await getUserMessages();
      if (response.data && response.data.conversations) {
        const sortedConversations = response.data.conversations.sort((a, b) => 
          new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt)
        );
        
        setConversations(sortedConversations);
        
        if (selectedConversation) {
          const updatedConversation = sortedConversations.find(
            c => c._id === selectedConversation._id
          );
          if (updatedConversation) {
            const sortedMessages = updatedConversation.messages.sort((a, b) => 
              new Date(a.createdAt) - new Date(b.createdAt)
            );
            setMessages(sortedMessages);
            setSelectedConversation(updatedConversation);
          }
        }
      }
    } catch (error) {
      // Check for auth errors specifically
      if (error.response && error.response.status === 401) {
        // Clear token if it's invalid
        localStorage.removeItem('token');
        toast.error('Your session has expired. Please login again.');
      } else {
        console.error('Error fetching messages:', error);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await sendMessage({
        advertId: selectedConversation.advert._id,
        recipientId: selectedConversation.participants.find(p => p._id !== currentUser._id)?._id,
        content: newMessage.trim()
      });

      const updatedMessages = [...messages, response.data.message].sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      );
      setMessages(updatedMessages);
      setNewMessage('');
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      fetchMessages();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleConversationSelect = async (conversation) => {
    const sortedMessages = conversation.messages.sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );
    setSelectedConversation(conversation);
    setMessages(sortedMessages);
    
    if (isMobile) {
      setShowConversations(false);
    }
    
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    const unreadMessages = conversation.messages.filter(
      message => !message.read && message.recipient._id === currentUser._id
    );
    
    await Promise.all(
      unreadMessages.map(message => markMessageAsRead(message._id))
    );
  };

  const handleBackToConversations = () => {
    setShowConversations(true);
  };

  const handleMessageOptions = (event, message) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(selectedMessage.content);
    toast.success('Message copied!');
    handleCloseMenu();
  };

  const handleReplyMessage = () => {
    setNewMessage(`Replying to: "${selectedMessage.content.substring(0, 30)}..."\n`);
    handleCloseMenu();
  };

  const getMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <MainContainer>
      <ContentWrapper>
        <MessagesContainer elevation={0}>
          <ConversationsList>
            <ConversationHeader>
              <SearchField
                fullWidth
                size="small"
                placeholder="Search conversations"
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </ConversationHeader>

            {conversations
              .filter(conv => 
                conv.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                conv.advert.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(conversation => (
                <ConversationItem
                  key={conversation._id}
                  selected={selectedConversation?._id === conversation._id}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <StyledBadge 
                    badgeContent={conversation.unreadCount} 
                    color="primary"
                    sx={{ mr: 2 }}
                  >
                    <StyledAvatar 
                      src={`https://i.pravatar.cc/150?u=${conversation.participants[0]._id}`}
                    />
                  </StyledBadge>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--primary-dark)' }} noWrap>
                      {conversation.participants.map(p => p.name).join(', ')}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {conversation.advert.title}
                    </Typography>
                    {conversation.lastMessage && (
                      <Typography 
                        variant="caption" 
                        color="textSecondary"
                        sx={{ 
                          display: 'block',
                          fontWeight: conversation.unreadCount > 0 ? 600 : 400
                        }}
                      >
                        {conversation.lastMessage.content.substring(0, 25)}
                        {conversation.lastMessage.content.length > 25 ? '...' : ''}
                      </Typography>
                    )}
                  </Box>
                  {conversation.lastMessage && (
                    <Typography 
                      variant="caption" 
                      color="textSecondary" 
                      sx={{ ml: 1, fontSize: '0.7rem' }}
                    >
                      {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                    </Typography>
                  )}
                </ConversationItem>
              ))}
          </ConversationsList>

          <ChatArea>
            {selectedConversation ? (
              <>
                <ChatHeader>
                  <StyledAvatar 
                    src={`https://i.pravatar.cc/150?u=${selectedConversation.participants[0]._id}`}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
                      {selectedConversation.participants.map(p => p.name).join(', ')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {selectedConversation.advert.title}
                    </Typography>
                  </Box>
                </ChatHeader>

                <MessagesArea ref={messagesAreaRef}>
                  {messages.map((message) => (
                    <MessageBubble
                      key={message._id}
                      sent={message.sender._id === currentUser._id}
                    >
                      <Typography variant="body1" sx={{ color: 'var(--text-dark)' }}>{message.content}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 0.5 }}>
                        <Typography variant="caption" color="textSecondary" sx={{ mr: 0.5, fontSize: '0.7rem' }}>
                          {getMessageTime(message.createdAt)}
                        </Typography>
                        {message.sender._id === currentUser._id && (
                          <DoneAllIcon sx={{ fontSize: 16, color: message.read ? 'var(--primary)' : '#667781' }} />
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMessageOptions(e, message)}
                        sx={{ 
                          position: 'absolute', 
                          right: 0, 
                          top: 0,
                          opacity: 0,
                          '&:hover': { opacity: 1 },
                          color: 'var(--primary)'
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </MessageBubble>
                  ))}
                  <div ref={messagesEndRef} />
                </MessagesArea>

                <InputArea>
                  <form onSubmit={handleSendMessage}>
                    <Grid container spacing={2}>
                      <Grid item xs>
                        <MessageInput
                          fullWidth
                          multiline
                          maxRows={4}
                          placeholder="Type a message"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <SendButton
                          type="submit"
                          variant="contained"
                          disabled={!newMessage.trim()}
                        >
                          <SendIcon />
                        </SendButton>
                      </Grid>
                    </Grid>
                  </form>
                </InputArea>
              </>
            ) : (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100%"
                sx={{ backgroundColor: 'rgba(248, 248, 248, 0.8)', position: 'relative', zIndex: 1 }}
              >
                <Box textAlign="center">
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      margin: '0 auto 16px',
                      backgroundColor: 'var(--primary-light)'
                    }}
                  >
                    <SendIcon sx={{ fontSize: 40, color: '#fff' }} />
                  </Avatar>
                  <Typography variant="h6" color="var(--primary-dark)" fontWeight={600}>
                    Your Messages
                  </Typography>
                  <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                    Select a conversation to start messaging
                  </Typography>
                </Box>
              </Box>
            )}
          </ChatArea>
        </MessagesContainer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{
            sx: {
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            }
          }}
        >
          <MenuItem onClick={handleCopyMessage} sx={{ color: 'var(--primary-dark)' }}>
            <ContentCopyIcon fontSize="small" sx={{ mr: 1, color: 'var(--primary)' }} /> Copy
          </MenuItem>
          <MenuItem onClick={handleReplyMessage} sx={{ color: 'var(--primary-dark)' }}>
            <ReplyIcon fontSize="small" sx={{ mr: 1, color: 'var(--primary)' }} /> Reply
          </MenuItem>
        </Menu>
      </ContentWrapper>
    </MainContainer>
  );
};

export default Messages;