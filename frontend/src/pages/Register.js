import React, { useState } from 'react';
import { registerUser } from '../services/api';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import Navbar from '../components/Navbar';

function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false); // Modal visibility state
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(formData);
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            // Check if error.response exists (for Axios or similar HTTP library)
            if (error.response && error.response.data) {
                setMessage(error.response.data.message || 'Registration failed.');
            } else {
                setMessage('An unexpected error occurred.');
            }
            setShowErrorModal(true); // Show the error modal when registration fails
        }
    };

    const closeModal = () => {
        setShowErrorModal(false); // Close the modal
    };

    return (
        <>
            <Navbar className="z-10" />
            <div
                className="bg-cover bg-center bg-no-repeat h-screen overflow-hidden relative"
                style={{ backgroundImage: 'url("./images/Home2.jpeg")' }} // Replace with actual background image URL
            >
                <div className="flex items-center justify-center h-screen">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded shadow-md w-80"
                    >
                        <h2 className="text-3xl font-extrabold text- mb-4 text-gray-900 underline">Register Vehicle</h2>
                        <input
                            name="username"
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="border p-2 mb-4 w-full bg-transparent text-gray-800 placeholder-gray-400"
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border p-2 mb-4 w-full bg-transparent text-gray-800 placeholder-gray-400"
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="border p-2 mb-4 w-full bg-transparent text-gray-800 placeholder-gray-400"
                        />

                        <button
                            type="submit"
                            className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 sm:mb-0 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-400 to-yellow-500 group-hover:from-red-400 group-hover:to-yellow-600 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400"
                        >
                            <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                Register
                            </span>
                        </button>

                        <Link to="/login">
                            <button className="underline pt-3 pl-3">
                                Have an account? Click Login
                            </button>
                        </Link>
                    </form>
                </div>
            </div>

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-80">
                        <h2 className="text-xl font-semibold text-red-500">Error</h2>
                        <p className="text-sm text-gray-800 mt-2">{message}</p>
                        <button
                            className="mt-4 w-full bg-red-500 text-white py-2 rounded"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Register;
