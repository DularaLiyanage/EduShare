import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/user';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const verifyOAuth2Token = async (token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/oauth2/verify`, { token });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Token verification failed');
  }
};