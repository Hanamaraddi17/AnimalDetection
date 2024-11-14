import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL
});

export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);

// Updated function for uploading animal images to the new endpoint
export const uploadAnimalImage = (formData, token) => API.post('/data/upload', formData, {
    headers: { Authorization: token },
});

// Updated function for fetching animal images to the new endpoint
export const fetchAnimalImages = (token) => API.get('/data/', { // Assuming this endpoint is for fetching images
    headers: { Authorization: token },
});
