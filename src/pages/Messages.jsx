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
import { getUserMessages, sendMessage, markMessageAsRead } from '../contexts/api';
import { toast } from 'react-toastify';

const MainContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f4f4f4',
  minHeight: '100vh',
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  }
}));

const MessagesContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  height: 'calc(100vh - 100px)',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    height: 'calc(100vh - 80px)',
  }
}));

const ConversationsList = styled(Box)(({ theme }) => ({
  width: '30%',
  borderRight: `1px solid ${theme.palette.divider}`,
  overflow: 'auto',
  backgroundColor: '#fff',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '40%',
    borderRight: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
  }
}));

const ConversationItem = styled(Box)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: selected ? '#fffacc' : '#fff',
  '&:hover': {
    backgroundColor: selected ? '#fffacc' : '#f5f5f5',
  }
}));

const ChatArea = styled(Box)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
});

const MessagesArea = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  overflow: 'auto',
  backgroundColor: '#fff'
}));

const MessageBubble = styled(Box)(({ theme, sent }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1, 2),
  borderRadius: '15px',
  marginBottom: theme.spacing(1),
  alignSelf: sent ? 'flex-end' : 'flex-start',
  backgroundColor: sent ? '#0a6638' : '#fffacc',
  color: sent ? '#fff' : '#000',
  position: 'relative'
}));

const InputArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#fff',
  borderTop: `1px solid ${theme.palette.divider}`
}));

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!localStorage.getItem('token')) {
      toast.error('Please login to view messages');
      return;
    }
    try {
      const response = await getUserMessages();
      const groupedConversations = groupMessagesByConversation(response.data.messages);
      setConversations(Object.values(groupedConversations));
      
      if (selectedConversation) {
        const updatedConversation = Object.values(groupedConversations).find(
          c => c._id === selectedConversation._id
        );
        if (updatedConversation) {
          setMessages(updatedConversation.messages);
          setSelectedConversation(updatedConversation);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch messages');
    }
  };

  const groupMessagesByConversation = (messages) => {
    return messages.reduce((acc, message) => {
      const otherUser = message.sender._id === currentUser._id ? message.recipient : message.sender;
      if (otherUser._id === currentUser._id) return acc;
      
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
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await sendMessage({
        advertId: selectedConversation.advert._id,
        recipientId: selectedConversation.otherUser._id,
        content: newMessage.trim()
      });

      const sentMessage = {
        ...response.data.message,
        sender: { _id: currentUser._id, name: currentUser.name },
        recipient: selectedConversation.otherUser
      };

      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      updateConversationsList(sentMessage);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const updateConversationsList = (newMessage) => {
    setConversations(prev => {
      const updated = [...prev];
      const index = updated.findIndex(c => c._id === selectedConversation._id);
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          lastMessage: newMessage,
          messages: [...updated[index].messages, newMessage]
        };
      }
      return updated;
    });
  };

  const handleConversationSelect = async (conversation) => {
    setSelectedConversation(conversation);
    setMessages(conversation.messages);
    
    conversation.messages.forEach(message => {
      if (!message.read && message.sender._id !== currentUser._id) {
        markMessageAsRead(message._id);
      }
    });
  };

  const handleMessageOptions = (event, message) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(selectedMessage.content);
    toast.success('Message copied to clipboard');
    handleCloseMenu();
  };

  const handleReplyMessage = () => {
    setNewMessage(`Reply to: "${selectedMessage.content.substring(0, 30)}..."\n`);
    handleCloseMenu();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <MainContainer>
      <MessagesContainer elevation={3}>
        <ConversationsList>
          <Box p={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search conversations..."
              InputProps={{
                startAdornment: <SearchIcon color="action" />
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
          {conversations
            .filter(conv => 
              conv.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              conv.advert.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(conversation => (
              <ConversationItem
                key={conversation._id}
                selected={selectedConversation?._id === conversation._id}
                onClick={() => handleConversationSelect(conversation)}
              >
                <Badge badgeContent={conversation.unreadCount} color="error">
                  <Avatar src={`https://i.pravatar.cc/150?u=${conversation.otherUser._id}`} />
                </Badge>
                <Box ml={2} flexGrow={1}>
                  <Typography variant="subtitle1">
                    {conversation.otherUser.name}
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
              <Box p={2} bgcolor="#fffacc">
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar src={`https://i.pravatar.cc/150?u=${selectedConversation.otherUser._id}`} />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6">
                      {selectedConversation.otherUser.name}
                    </Typography>
                    <Typography variant="body2">
                      {selectedConversation.advert.title}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <MessagesArea>
                {messages.map((message) => (
                  <MessageBubble
                    key={message._id}
                    sent={message.sender._id === currentUser._id}
                  >
                    <Typography variant="body1">{message.content}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', right: 0, top: 0 }}
                      onClick={(e) => handleMessageOptions(e, message)}
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
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={!newMessage.trim()}
                        sx={{ backgroundColor: '#0a6638', height: '100%' }}
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