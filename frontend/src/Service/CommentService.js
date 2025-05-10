import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/comments';

export const createComment = async (commentData) => {
  try {
    const response = await axios.post(API_BASE_URL, commentData);
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const getCommentsByPostId = async (postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/post/${postId}`);
    return response.data._embedded?.commentList || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const updateComment = async (id, content) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, { content });
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export const deleteComment = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const getCommentsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
    return response.data._embedded?.commentList || [];
  } catch (error) {
    console.error('Error fetching user comments:', error);
    throw error;
  }
};