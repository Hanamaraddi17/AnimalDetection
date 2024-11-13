import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);
export const uploadAnimalImage = (formData, token) => API.post('/animal-images/upload', formData, {
    headers: { Authorization: token },
});
export const fetchAnimalImages = (token) => API.get('/animal-images', {
    headers: { Authorization: token },
});
