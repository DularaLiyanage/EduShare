import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/likes';

export const likePost = async (userId, postId) => {
  try {
    const response = await axios.post(API_BASE_URL, { userId, postId });
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const unlikePost = async (userId, postId) => {
  try {
    const response = await axios.delete(API_BASE_URL, {
      params: { userId, postId }
    });
    return response.data;
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

export const getLikesByPostId = async (postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/post/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching likes:', error);
    throw error;
  }
};

export const getLikeCount = async (postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/count/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching like count:', error);
    throw error;
  }
  
};

export const getLikedPostIdsByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching liked post IDs:', error);
    throw error;
  }
};

export const getUsersWhoLikedPost = async (postId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/likes/post/${postId}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users who liked post:', error);
    throw error;
  }
};

