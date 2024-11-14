import React, { useState } from 'react';   
import Navbar from '../components/Navbar';
import axios from 'axios';

function UploadAnimalData() {
    const [file, setFile] = useState(null);
    const [animalName, setAnimalName] = useState('');
    const [location, setLocation] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [time, setTime] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file || !animalName || !location || !latitude || !longitude || !time) {
            setError('All fields are required.');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess(false);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('animalName', animalName);
        formData.append('location', location);
        formData.append('time', time);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Authentication token is missing. Please log in.');
                return;
            }

            // Use environment variable for the backend URL
            const response = await axios.post(
                `https://animal-detection-backend.vercel.app/data/upload`, // Dynamic URL based on environment variable
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Animal data uploaded:', response.data);

            setAnimalName('');
            setLocation('');
            setTime('');
            setLatitude('');
            setLongitude('');
            setFile(null);
            setSuccess(true);

        } catch (error) {
            console.error('Error uploading animal data:', error);

            if (error.response) {
                setError(error.response.data.message || 'Failed to upload animal data. Please try again.');
            } else if (error.request) {
                setError('Network error. Please check your connection and try again.');
            } else {
                setError('An error occurred while preparing the upload request.');
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Navbar className="z-10" />
            <div className="bg-center h-screen overflow-hidden relative" style={{ backgroundImage: 'url("./images/car.jpeg")' }}>
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                <div className="relative flex flex-col items-center justify-center h-full p-6 text-white">
                    <div className="w-full max-w-xs z-10">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-teal-300 via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
                            Upload Animal Data
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-2">
                            <div>
                                <label className="text-sm font-semibold">Animal Name</label>
                                <input
                                    type="text"
                                    value={animalName}
                                    onChange={(e) => setAnimalName(e.target.value)}
                                    className="w-full mt-2 p-2 text-sm rounded-lg border-2 border-gray-300 bg-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold">Location</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full mt-2 p-2 text-sm rounded-lg border-2 border-gray-300 bg-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold">Latitude</label>
                                <input
                                    type="text"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                    className="w-full mt-2 p-2 text-sm rounded-lg border-2 border-gray-300 bg-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold">Longitude</label>
                                <input
                                    type="text"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                    className="w-full mt-2 p-2 text-sm rounded-lg border-2 border-gray-300 bg-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold">Time</label>
                                <input
                                    type="datetime-local"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full mt-2 p-2 text-sm rounded-lg border-2 border-gray-300 bg-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold">Animal Image</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full mt-2 p-2 text-sm rounded-lg border-2 border-gray-300"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-xs">{error}</div>
                            )}

                            {success && (
                                <div className="text-green-500 text-xs">Animal data uploaded successfully!</div>
                            )}

                            <div className="flex justify-center gap-4">
                                <button
                                    type="submit"
                                    className="mt-3 w-full sm:w-auto relative inline-flex items-center justify-center p-0.5 mb-2 sm:mb-0 me-2 overflow-hidden text-xs font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-400 to-lime-400 group-hover:from-teal-400 group-hover:to-lime-500 focus:ring-4 focus:outline-none focus:ring-lime-200"
                                    disabled={uploading}
                                >
                                    <span className="w-full relative px-4 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                                        {uploading ? 'Uploading...' : 'Upload Animal Data'}
                                    </span>
                                </button>
                            </div> 
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UploadAnimalData;
