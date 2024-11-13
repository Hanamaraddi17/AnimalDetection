import React, { useState, useEffect } from 'react';
import { loginUser } from '../services/api';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Importing eye icons

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [status, setStatus] = useState({ message: '', isError: false, isRedirecting: false });  // Merged state
    const navigate = useNavigate(); // Initialize useNavigate for redirection

    useEffect(() => {
        if (status.isRedirecting) {
            const timer = setTimeout(() => {
                navigate('/'); // Redirect to home page after 3 seconds
            }, 2000);

            return () => clearTimeout(timer); // Cleanup timeout on unmount
        }
    }, [status.isRedirecting, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(formData);
            localStorage.setItem('token', response.data.token); // Store token
            setStatus({ message: 'Hold up tight, we are redirecting you to the home page...', isError: false, isRedirecting: true });
        } catch (error) {
            // Check if error.response exists and contains a message
            if (error.response && error.response.data) {
                setStatus({ message: error.response.data.message || 'Login failed. Please try again.', isError: true, isRedirecting: false });
            } else {
                setStatus({ message: 'An unexpected error occurred.', isError: true, isRedirecting: false });
            }
        }
    };

    // Toggle password visibility
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <>
            <Navbar className="z-10" />
            <div
                className="bg-cover bg-center bg-no-repeat h-screen overflow-hidden relative"
                style={{ backgroundImage: 'url("./images/Home1.jpeg")' }} // Replace with actual background image URL
            >
                <div className="flex items-center justify-center h-screen">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                        <h2 className="text-xl font-bold mb-4">Login</h2>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border p-2 mb-4 w-full"
                        />
                        <div className="relative mb-4">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="border p-2 mb-4 w-full"
                            />
                            <span
                                className="absolute right-3 top-3 cursor-pointer"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                        <button
                            type="submit"
                            className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
                        >
                            <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                Login
                            </span>
                        </button>
                        <Link to="/register">
                            <button className="underline pl-1">
                                Don't have an account? Register
                            </button>
                        </Link>
                    </form>
                </div>
            </div>

            {/* Error/Success Modal Popup */}
            {status.message && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`bg-white p-6 rounded shadow-md w-80 ${status.isError ? 'border-red-500' : 'border-green-500'}`}>
                        <h2 className={`text-xl font-semibold ${status.isError ? 'text-red-500' : 'text-green-500'}`}>
                            {status.isError ? 'Error' : 'Success'}
                        </h2>
                        <p className={`text-sm text-gray-800 mt-2 ${status.isError ? 'text-red-500' : 'text-green-500'}`}>
                            {status.message}
                        </p>
                        <button
                            className={`mt-4 w-full ${status.isError ? 'bg-red-500' : 'bg-green-500'} text-white py-2 rounded`}
                            onClick={() => setStatus({ ...status, message: '', isError: false, isRedirecting: false })}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Redirecting Message */}
            {status.isRedirecting && (
                <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-6 rounded-lg shadow-md z-50">
                    {status.message}
                </div>
            )}
        </>
    );
}

export default Login;
