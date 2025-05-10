import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/follows';

export const followUser = async (followerId, followingId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${followerId}/follow/${followingId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to follow user');
  }
};

export const unfollowUser = async (followerId, followingId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${followerId}/unfollow/${followingId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to unfollow user');
  }
};

export const getFollowers = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}/followers`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch followers');
  }
};

export const getFollowing = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}/following`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch following');
  }
};