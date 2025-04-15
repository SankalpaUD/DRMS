import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Landing = () => {
    return (
        <div className="landing-container flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white h-screen relative font-sans">
            <header className="landing-header text-center px-6 lg:px-12">
                <div className="flex items-center absolute top-5 left-5">
                    <img src={logo} alt="logo" className="w-16 h-16" style={{ filter: 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.6))' }} />
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6" style={{ textShadow: '4px 6px 10px rgba(0, 0, 0, 0.7)' }}>
                    Streamline Your Resource Allocation
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed" style={{ textShadow: '2px 3px 5px rgba(0, 0, 0, 0.5)' }}>
                    Welcome to ResourceFlow, the ultimate solution for managing department 
                    resources. Whether you're a student, faculty, or staff member, This 
                    platform provides everything you need to book and manage resources 
                    with ease and efficiency.
                </p>

                <Link to="/home">
                    <button className="py-4 px-6 rounded-lg bg-white text-indigo-900 font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:opacity-90 shadow-lg" style={{ boxShadow: '4px 6px 10px rgba(0, 0, 0, 0.4)' }}>
                        Get Started
                    </button>
                </Link>
            </header>
        </div>
    );
};

export default Landing;