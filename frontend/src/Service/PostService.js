import axios from 'axios';

const API_URL = 'http://localhost:8080/api/posts'; // Replace with your backend URL

const getAllPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data._embedded.posts; // Adjust based on your HATEOAS response structure
};

const createPost = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const updatePost = async (id, formData) => {
  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const deletePost = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export default {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
};