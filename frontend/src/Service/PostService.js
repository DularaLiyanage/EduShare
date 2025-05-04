import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/posts';

export const createPost = async (files, description, userId) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  formData.append('description', description);
  formData.append('userId', userId);

  try {
    const response = await axios.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getAllPosts = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data._embedded?.postList || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getPostById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

export const getPostsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
    return response.data._embedded?.postList || [];
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

export const updatePost = async (id, files, description) => {
  const formData = new FormData();
  if (files) {
    files.forEach(file => formData.append('files', file));
  }
  formData.append('description', description);

  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};