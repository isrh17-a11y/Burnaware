import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User Registration
export const registerUser = async (email, username, password, fullName = null) => {
  try {
    const response = await apiClient.post('/users/register', {
      email,
      username,
      password,
      full_name: fullName,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || 'Registration failed. Please try again.',
    };
  }
};

// User Login
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/users/login', {
      email,
      password,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || 'Login failed. Please check your credentials.',
    };
  }
};

// Store user data in localStorage
export const storeUserData = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

// Get user data from localStorage
export const getUserData = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

// Clear user data (logout)
export const clearUserData = () => {
  localStorage.removeItem('user');
};

export default {
  registerUser,
  loginUser,
  storeUserData,
  getUserData,
  clearUserData,
};
