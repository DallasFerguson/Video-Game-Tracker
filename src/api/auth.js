import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, {
      username: userData.username,
      email: userData.email,
      password: userData.password
    });
    return {
      user: response.data.user,
      token: response.data.token
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: credentials.email,
      password: credentials.password
    });
    return {
      user: response.data.user,
      token: response.data.token
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const getCurrentUserProfile = async (token) => {
  try {
    const response = await axios.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

export const updateUserProfile = async (token, updates) => {
  try {
    const response = await axios.put(`${API_BASE}/users/me`, updates, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Profile update failed');
  }
};