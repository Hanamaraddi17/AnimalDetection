import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

function Navbar() {
    // Check if the user is logged in by checking the token in localStorage
    const isLoggedIn = localStorage.getItem('token');
    const navigate = useNavigate(); // Initialize useNavigate hook

    return (
        <nav className="bg-gray-800 p-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                <Link to="/" className="text-white text-xl font-semibold">Animal Detection App</Link>
                <div className="flex gap-6">
                    <Link to="/" className="text-white hover:text-gray-400">Home</Link>

                    {/* Conditionally render links based on login status */}
                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="text-white hover:text-gray-400">Login</Link>
                            <Link to="/register" className="text-white hover:text-gray-400">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" className="text-white hover:text-gray-400">Dashboard</Link>
                            {/* You can add a Logout link that clears the token */}
                            <Link
                                to="/login"
                                className="text-white hover:text-gray-400"
                                onClick={() => {
                                    localStorage.removeItem('token');  // Remove the token from localStorage
                                    navigate('/');
                                    window.location.reload();  // Optionally reload the page
                                }}
                            >
                                Logout
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
