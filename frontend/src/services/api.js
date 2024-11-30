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
export const fetchAnimalImages = (token) => API.get('/data/', {
    headers: { Authorization: token },
});

export const deleteAnimalImage = async (imageId) => {
    const token = localStorage.getItem('token');
    
    try {
        const response = await API.delete(`/data/delete/${imageId}`, {
            headers: { Authorization: token }, // Ensure token is prefixed with "Bearer"
        });
        return response;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw new Error('Failed to delete image');
    }
};
