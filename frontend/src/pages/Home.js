import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Home() {
    return (
        <>
            <Navbar className="z-10" />
            <div
                className="bg-center  h-screen overflow-hidden relative"
                style={{ backgroundImage: 'url("./images/Home.jpeg")' }} // Replace with actual background image URL
            >
                {/* Overlay for better readability */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                <div className="relative flex flex-col items-center justify-center h-full p-6 text-white">
                    <div className="text-center max-w-lg z-10">
                        {/* Header with gradient text color */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-teal-300 via-blue-100 to-purple-200 bg-clip-text text-transparent mb-6">
                            Welcome to the Animal Detection App
                        </h1>
                        
                        {/* Paragraph with multi-color gradient text */}
                        <p className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-200 via-red- to-yellow-300 bg-clip-text text-transparent mb-8">
                            Detect and log animal sightings from vehicles, storing data like time, animal name, image, and location. 
                            Log in to view and manage the data.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/login">
                                <button className="w-full sm:w-auto relative inline-flex items-center justify-center p-0.5 mb-2 sm:mb-0 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-400 to-lime-400 group-hover:from-teal-400 group-hover:to-lime-500 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
                                    <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                        Login
                                    </span>
                                </button>
                            </Link>

                            <Link to="/register">
                                <button className="relative inline-flex items-center justify-center p-0.5 mb-2 sm:mb-0 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-400 to-yellow-500 group-hover:from-red-400 group-hover:to-yellow-600 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">
                                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                        Register
                                    </span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
