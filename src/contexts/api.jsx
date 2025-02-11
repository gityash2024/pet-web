import { baseUrl } from "../environment/environment";
import instance from "./httpInterceptor";

// Existing functions
export const registerUser = (data) => {
  return instance.post(`${baseUrl}users/register`, data);
};

export const loginUser = (data) => {
  return instance.post(`${baseUrl}users/login`, data);
};

export const googleAuth = (data) => {
  return instance.post(`${baseUrl}users/auth/google`, data);
};

export const generateOTP = (data) => {
  return instance.post(`${baseUrl}users/generate-otp`, data);
};

export const verifyOTP = (data) => {
  return instance.post(`${baseUrl}users/verify-otp`, data);
};






export const addAdvert = (data) => {
  return instance.post(`${baseUrl}users/adverts`, data);
};

// New functions to add


export const getAllAdverts = (page = 1, limit = 9) => {
  return instance.get(`${baseUrl}adverts?page=${page}&limit=${limit}`);
};

export const getUserAdverts = () => {
  return instance.get(`${baseUrl}users/adverts`);
};

export const getAdvertById = (id) => {
  return instance.get(`${baseUrl}adverts/${id}`);
};

export const createAdvert = (data) => {
  return instance.post(`${baseUrl}adverts`, data);
};

export const updateAdvert = (id, data) => {
  return instance.put(`${baseUrl}adverts/${id}`, data);
};

export const deleteAdvert = (id) => {
  return instance.delete(`${baseUrl}adverts/${id}`);
};



// Additional functions for forgot password and reset password
export const forgotPassword = (email) => {
  return instance.post(`${baseUrl}users/forgot-password`, { email });
};

export const resetPassword = (resetToken, password) => {
  return instance.put(`${baseUrl}users/reset-password/${resetToken}`, { password });
};
// In api.js
export const getUserProfile = () => {
  return instance.get(`${baseUrl}users/profile`);
};

export const updateUserProfile = (data) => {
  return instance.put(`${baseUrl}users/profile`, data);
};

export const getAllArticles = () => {
  return instance.get(`${baseUrl}articles`);
};

export const bookmarkArticle = (articleId) => {
  return instance.post(`${baseUrl}articles/${articleId}/bookmark`);
};

export const unbookmarkArticle = (articleId) => {
  return instance.delete(`${baseUrl}articles/${articleId}/bookmark`);
};

export const getArticleById = (id) => {
  return instance.get(`${baseUrl}articles/${id}`);
};

export const getAllPets = () => {
  return instance.get(`${baseUrl}pets`);
};

export const getPetById = (id) => {
  return instance.get(`${baseUrl}pets/${id}`);
};

export const getAllAccessories = () => {
  return instance.get(`${baseUrl}accessories`);
};

export const getAccessoryById = (id) => {
  return instance.get(`${baseUrl}accessories/${id}`);
};

export const toggleFavorite = (itemType, itemId) => {
  return instance.post(`${baseUrl}favorites/toggle`, { itemType, itemId });
};

export const getFavorites = () => {
  return instance.get(`${baseUrl}favorites`);
};

export const getAllCategories=() => {
  return instance.get(`${baseUrl}categories`);
};


export const getAdvertConversation = (advertId) => {
  return instance.get(`${baseUrl}messages/advert/${advertId}`);
};





export const getUserMessages = () => {
  return instance.get('/messages');
};

export const sendMessage = (data) => {
  return instance.post('/messages', data);
};

export const markMessageAsRead = (messageId) => {
  return instance.put(`/messages/${messageId}/read`);
};

export const startConversation = (advertId) => {
/*************  ✨ Codeium Command ⭐  *************/
/**
 * Retrieves all messages for the current user
 * 
 * @returns {Promise<AxiosResponse<any>>} A promise resolving to the API response
 */
/******  09131b1d-67a9-4c44-852f-2f10b694e521  *******/  return instance.post('/messages/start-conversation', { advertId });
};