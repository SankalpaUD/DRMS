import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsMenuOpen(false); // Close the menu when a link is clicked
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full min-h-[65px] bg-indigo-500 shadow-lg flex justify-center items-center">
      <div className="w-full h-auto px-8 md:px-16 flex justify-between items-center gap-14">
        {/* Logo Section */}
        <div className="flex justify-start items-center">
          <Link to="/home" className="flex items-center" onClick={() => handleLinkClick('/home')}>
            <img src={logo} alt="logo" className="w-10 h-10" />
            <div className="text-white text-lg md:text-2xl font-extrabold whitespace-nowrap overflow-hidden text-ellipsis tracking-wide uppercase ml-1">
              Resource<span className="text-yellow-300">Flow</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links for Larger Screens */}
        <div className="hidden md:flex justify-end items-center gap-4 flex-wrap">
          <div className="flex justify-start items-center gap-4 md:gap-14">
            <Link
              to="/home"
              className={`text-base font-medium transition duration-500 hover:text-yellow-300 ${activeLink === '/home' ? 'text-yellow-300' : 'text-white'}`}
              onClick={() => handleLinkClick('/home')}
            >
              Home
            </Link>
            <Link
              to="/resources"
              className={`text-base font-medium transition duration-500 hover:text-yellow-300 ${activeLink === '/resources' ? 'text-yellow-300' : 'text-white'}`}
              onClick={() => handleLinkClick('/resources')}
            >
              Resources
            </Link>
            <Link
              to="/bookings"
              className={`text-base font-medium transition duration-500 hover:text-yellow-300 ${activeLink === '/bookings' ? 'text-yellow-300' : 'text-white'}`}
              onClick={() => handleLinkClick('/bookings')}
            >
              Bookings
            </Link>
            <Link
              to="/user-guide"
              className={`text-base whitespace-nowrap font-medium transition duration-500 hover:text-yellow-300 mr-6 ${activeLink === '/user-guide' ? 'text-yellow-300' : 'text-white'}`}
              onClick={() => handleLinkClick('/user-guide')}
            >
              User Guide
            </Link>
          </div>
          <div className="flex justify-start items-center gap-4">
            <Link
              to="/signup"
              className={`w-28 mb-2 mt-2 text-center px-5 py-2 border border-white text-base font-medium rounded hover:bg-white hover:text-blue-500 transition duration-500 ${
                activeLink === '/signup' ? 'text-blue-500 bg-white' : 'text-white'
              }`}
              onClick={() => handleLinkClick('/signup')}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className={`w-28 mb-2 mt-2 text-center px-5 py-2 bg-white text-blue-500 text-base font-medium rounded hover:bg-gray-200 transition duration-500 ${
                activeLink === '/login' ? 'text-blue-500 bg-white' : 'text-blue'
              }`}
              onClick={() => handleLinkClick('/login')}
            >
              Login
            </Link>
          </div>
        </div>

        {/* Hamburger Menu Button for Smaller Screens */}
        <div className="md:hidden flex items-center">
          <button className="text-white" onClick={toggleMenu}>
            Menu
          </button>
        </div>
      </div>

      {/* Dropdown Menu for Smaller Screens */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center bg-indigo-500 w-full py-2 transition duration-300">
          <Link
            to="/home"
            className={`text-base font-medium transition duration-500 hover:text-yellow-300 ${activeLink === '/home' ? 'text-yellow-300' : 'text-white'}`}
            onClick={() => handleLinkClick('/home')}
          >
            Home
          </Link>
          <Link
            to="/resources"
            className={`text-base font-medium transition duration-500 hover:text-yellow-300 ${activeLink === '/resources' ? 'text-yellow-300' : 'text-white'}`}
            onClick={() => handleLinkClick('/resources')}
          >
            Resources
          </Link>
          <Link
            to="/bookings"
            className={`text-base font-medium transition duration-500 hover:text-yellow-300 ${activeLink === '/bookings' ? 'text-yellow-300' : 'text-white'}`}
            onClick={() => handleLinkClick('/bookings')}
          >
            Bookings
          </Link>
          <Link
            to="/user-guide"
            className={`text-base font-medium transition duration-500 hover:text-yellow-300 ${activeLink === '/user-guide' ? 'text-yellow-300' : 'text-white'}`}
            onClick={() => handleLinkClick('/user-guide')}
          >
            User Guide
          </Link>
          <Link
            to="/signup"
            className={`w-28 mt-1 text-center px-5 py-2 border border-white text-base font-medium rounded hover:bg-white hover:text-blue-500 transition duration-500 ${
              activeLink === '/signup' ? 'text-blue-500 bg-white' : 'text-white'
            }`}
            onClick={() => handleLinkClick('/signup')}
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className={`w-28 mt-2 text-center px-5 py-2 bg-white text-blue-500 text-base font-medium rounded hover:bg-gray-200 transition duration-500 ${
              activeLink === '/login' ? 'text-blue-500 bg-white' : 'text-blue'
            }`}
            onClick={() => handleLinkClick('/login')}
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
