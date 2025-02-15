import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, IconButton, Avatar, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplyIcon from '@mui/icons-material/Reply';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { getUserMessages, sendMessage, markMessageAsRead } from '../contexts/api';
import { toast } from 'react-toastify';

const MainContainer = styled(Box)({
  backgroundColor: '#f0f2f5',
  minHeight: '100vh',
  padding: '16px',
  '@media (max-width: 600px)': {
    padding: '8px'
  }
});

const MessagesContainer = styled(Paper)({
  display: 'flex',
  height: 'calc(100vh - 100px)',
  overflow: 'hidden',
  borderRadius: '12px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
});

const ConversationsList = styled(Box)({
  width: '30%',
  borderRight: '1px solid #e0e0e0',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  '@media (max-width: 600px)': {
    width: '100%'
  }
});

const ConversationHeader = styled(Box)({
  padding: '10px 16px',
  backgroundColor: '#f0f2f5',
  borderBottom: '1px solid #e0e0e0'
});

const ConversationItem = styled(Box)(({ selected }) => ({
  padding: '12px 16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: selected ? '#f0f2f5' : '#fff',
  '&:hover': {
    backgroundColor: '#f5f6f6'
  },
  borderBottom: '1px solid #e0e0e0'
}));

const ChatArea = styled(Box)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#efeae2',
  backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
  backgroundSize: 'contain'
});

const ChatHeader = styled(Box)({
  padding: '10px 16px',
  backgroundColor: '#f0f2f5',
  borderBottom: '1px solid #e0e0e0',
  display: 'flex',
  alignItems: 'center'
});

const MessagesArea = styled(Box)({
  flexGrow: 1,
  padding: '20px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
});

const MessageBubble = styled(Box)(({ sent }) => ({
  maxWidth: '65%',
  padding: '8px 12px',
  borderRadius: sent ? '8px 0 8px 8px' : '0 8px 8px 8px',
  alignSelf: sent ? 'flex-end' : 'flex-start',
  backgroundColor: sent ? '#e7ffdb' : '#fff',
  boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
  position: 'relative',
  marginBottom: '4px'
}));

const InputArea = styled(Box)({
  padding: '12px 16px',
  backgroundColor: '#f0f2f5',
  borderTop: '1px solid #e0e0e0'
});

const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f0f2f5',
    borderRadius: '8px',
    '& fieldset': {
      border: 'none'
    }
  }
});

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesAreaRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

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
    if (!localStorage.getItem('token')) {
      toast.error('Please login to view messages');
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
      console.error('Error fetching messages:', error);
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
      <MessagesContainer elevation={0}>
        <ConversationsList>
          <ConversationHeader>
            <SearchField
              fullWidth
              size="small"
              placeholder="Search or start new chat"
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
                <Badge 
                  badgeContent={conversation.unreadCount} 
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  <Avatar 
                    src={`https://i.pravatar.cc/150?u=${conversation.participants[0]._id}`}
                    sx={{ width: 48, height: 48 }}
                  />
                </Badge>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" noWrap>
                    {conversation.participants.map(p => p.name).join(', ')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {conversation.advert.title}
                  </Typography>
                </Box>
              </ConversationItem>
            ))}
        </ConversationsList>

        <ChatArea>
          {selectedConversation ? (
            <>
              <ChatHeader>
                <Avatar 
                  src={`https://i.pravatar.cc/150?u=${selectedConversation.participants[0]._id}`}
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1">
                    {selectedConversation.participants.map(p => p.name).join(', ')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
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
                    <Typography variant="body1">{message.content}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 0.5 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ mr: 0.5 }}>
                        {getMessageTime(message.createdAt)}
                      </Typography>
                      {message.sender._id === currentUser._id && (
                        <DoneAllIcon sx={{ fontSize: 16, color: message.read ? '#53bdeb' : '#667781' }} />
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
                        '&:hover': { opacity: 1 }
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
                      <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        placeholder="Type a message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                          }
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={!newMessage.trim()}
                        sx={{ 
                          backgroundColor: '#0a6638',
                          height: '100%',
                          minWidth: '50px',
                          '&:hover': {
                            backgroundColor: '#0a6638'
                          }
                        }}
                      >
                        <SendIcon />
                      </Button>
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
              sx={{ backgroundColor: '#f0f2f5' }}
            >
              <Typography variant="h6" color="textSecondary">
                Select a conversation to start messaging
              </Typography>
            </Box>
          )}
        </ChatArea>
      </MessagesContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleCopyMessage}>
          <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} /> Copy
        </MenuItem>
        <MenuItem onClick={handleReplyMessage}>
          <ReplyIcon fontSize="small" sx={{ mr: 1 }} /> Reply
        </MenuItem>
      </Menu>
    </MainContainer>
  );
};

export default Messages;