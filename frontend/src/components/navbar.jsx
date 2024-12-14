import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <div className="w-full h-[72px] bg-indigo-400 shadow-lg flex justify-center items-center">
      <div className="w-full h-[72px] px-8 md:px-16 flex justify-between items-center gap-14">
        <div className="flex justify-start items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="logo" className="w-8 h-8 md:w-10 md:h-10 transform transition-transform duration-300 hover:scale-110 hover:shadow-2xl" />
            <div className="text-white text-lg md:text-2xl font-extrabold whitespace-nowrap overflow-hidden text-ellipsis tracking-wide uppercase ml-1">
              Resource<span className="text-yellow-300">Flow</span>
            </div>
          </Link>
        </div>
        <div className="hidden md:flex justify-end items-center gap-14">
          <div className="flex justify-start items-center gap-14">
            <Link to="/" className="text-white text-base font-medium hover:text-gray-200 transition duration-300 hover:underline">Home</Link>
            <Link to="/resources" className="text-white text-base font-medium hover:text-gray-200 transition duration-300 hover:underline">Resources</Link>
            <Link to="/bookings" className="text-white text-base font-medium hover:text-gray-200 transition duration-300 hover:underline">Bookings</Link>
            <Link to="/user-guide" className="text-white text-base font-medium hover:text-gray-200 transition duration-300 hover:underline">User Guide</Link>
          </div>
          <div className="flex justify-start items-start gap-4">
            <Link to="/signup" className="px-5 py-2 border border-white text-white text-base font-medium rounded hover:bg-white hover:text-blue-500 transition duration-300">Sign Up</Link>
            <Link to="/login" className="px-5 py-2 bg-white text-blue-500 text-base font-medium rounded hover:bg-gray-200 transition duration-300">Login</Link>
          </div>
        </div>
        <div className="md:hidden flex items-center">
          <button className="text-white">Menu</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
