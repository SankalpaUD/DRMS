import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaBars, FaTimes } from 'react-icons/fa';
import { logoutSuccess } from '../redux/user/userSlice';
import Sidebar from './SideBar';
import logo from '../assets/logo.png';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';

const Navbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUpSideBarOpen, setIsUpSideBarOpen] = useState(false);
  const [isLeftSideBarOpen, setIsLeftSideBarOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileImageRef = useRef(null);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(logoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsLeftSideBarOpen(false);
      toggleSidebar(false);
    }
  };

  useEffect(() => {
    setActiveLink(location.pathname);

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileImageRef.current &&
        !profileImageRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/api/user/notifications/${currentUser._id}`);
        const unreadNotifications = response.data.filter(notification => !notification.read);
        setHasNewNotifications(unreadNotifications.length > 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
    
  }, [dropdownRef, profileImageRef, location.pathname, currentUser]);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (event) => {
    event.stopPropagation(); 
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleUpSideBar = () => {
    setIsUpSideBarOpen((prev) => !prev);
    if (isLeftSideBarOpen) {
      setIsLeftSideBarOpen(false);
      toggleSidebar(false);
    }
  };

  const toggleLeftSideBar = () => {
    setIsLeftSideBarOpen((prev) => !prev);
    if (isUpSideBarOpen) {
      setIsUpSideBarOpen(false);
    }
    toggleSidebar();
  };

  return (
    <div className="relative">
      {/* Navbar Container */}
      <div className="w-full min-h-[65px] bg-indigo-500 shadow-lg flex justify-between items-center px-4 md:px-8 fixed z-10">
        {/* Logo & Sidebar Toggle */}
        <div className="flex items-center gap-4">
          <button className="text-white hidden md:block" onClick={() => { toggleLeftSideBar(); toggleSidebar(); }}>
            <FaBars size={28} />
          </button>
          <button className="text-white md:hidden" onClick={toggleUpSideBar}>
            {isUpSideBarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <Link to="/home" className="flex items-center" onClick={() => handleLinkClick('/home')}>
            <img src={logo} alt="logo" className="w-8 h-8" />
            <div className="text-white text-lg md:text-2xl font-extrabold tracking-wide uppercase ml-1 md:truncate md:max-w-[100px] lg:max-w-[250px]">
              Resource<span className="text-yellow-300">Flow</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links & Avatar */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-8">
            <Link
              to="/home"
              className={`text-base font-medium transition duration-500 hover:text-yellow-300 ${
                activeLink === '/home' ? 'text-yellow-300' : 'text-white'
              }`}
              onClick={() => handleLinkClick('/home')}
            >
              Home
            </Link>
            <Link
              to="/resources"
              className={`text-base font-medium transition duration-500 hover:text-yellow-300 ${
                activeLink === '/resources' ? 'text-yellow-300' : 'text-white'
              }`}
              onClick={() => handleLinkClick('/resources')}
            >
              Resources
            </Link>
            <Link
              to="/bookings"
              className={`text-base font-medium transition duration-500 hover:text-yellow-300 ${
                activeLink === '/bookings' ? 'text-yellow-300' : 'text-white'
              }`}
              onClick={() => handleLinkClick('/bookings')}
            >
              Bookings
            </Link>
            <Link
              to="/user-guide"
              className={`text-base font-medium transition duration-500 hover:text-yellow-300 ${
                activeLink === '/user-guide' ? 'text-yellow-300' : 'text-white'
              }`}
              onClick={() => handleLinkClick('/user-guide')}
            >
              User Guide
            </Link>
          </div>

          {/* Profile or Auth Buttons */}
          {currentUser ? (
            
            <div className="relative">
              <div className='flex items-center gap-4'>
              <Link to="/notifications" className="relative">
              <NotificationsIcon style={{ color: 'white' }} />
              {hasNewNotifications && (
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
              )}
              </Link>
              <img
                ref={profileImageRef}
                src={currentUser.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full cursor-pointer object-cover"
                style={{ minWidth: '36px', minHeight: '36px' }}
                onClick={toggleDropdown}
              />

              </div>

              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg min-w-max z-20"
                >
                  <p className="px-4 py-2 border-b text-gray-800 font-semibold">
                    {currentUser.name}
                  </p>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    onClick={() => handleLinkClick('/profile')}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    onClick={() => handleLinkClick('/settings')}
                  >
                    Settings
                  </Link>
                  <Link
                    to="/home"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false); // Hide dropdown when logout is clicked
                    }}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/signup"
                className="px-5 py-2 border border-white text-white rounded hover:bg-white hover:text-blue-500 transition duration-500 whitespace-nowrap"
                onClick={() => handleLinkClick('/signup')}
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="px-5 py-2 bg-white text-blue-500 rounded hover:bg-gray-200 transition duration-500"
                onClick={() => handleLinkClick('/login')}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isUpSideBarOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-20 mt-[65px]">
          <Link
            to="/home"
            className="block px-6 py-3 text-black hover:bg-slate-200"
            onClick={toggleUpSideBar}
          >
            Home
          </Link>
          <hr />
          <Link
            to="/resources"
            className="block px-6 py-3 text-black hover:bg-slate-200"
            onClick={toggleUpSideBar}
          >
            Resources
          </Link>
          <hr />
          <Link
            to="/bookings"
            className="block px-6 py-3 text-black hover:bg-slate-200"
            onClick={toggleUpSideBar}
          >
            Bookings
          </Link>
          <hr />
          <Link
            to="/user-guide"
            className="block px-6 py-3 text-black hover:bg-slate-200"
            onClick={toggleUpSideBar}
          >
            User Guide
          </Link>
          <hr />
          {currentUser ? (
            <>
              <Link
                to="/profile"
                className="block px-6 py-3 text-black hover:bg-slate-200"
                onClick={toggleUpSideBar}
              >
                Profile
              </Link>
              <hr />
              <Link
                to="/settings"
                className="block px-6 py-3 text-black hover:bg-slate-200"
                onClick={toggleUpSideBar}
              >
                Settings
              </Link>
              <hr />
              <Link
                to="/logout"
                className="block px-6 py-3 text-black hover:bg-slate-200"
                onClick={toggleUpSideBar}
              >
                Logout
              </Link>
              <hr />
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="block px-6 py-3 text-black hover:bg-slate-200"
                onClick={toggleUpSideBar}
              >
                Sign Up
              </Link>
              <hr />
              <Link
                to="/login"
                className="block px-6 py-3 text-black hover:bg-slate-200"
                onClick={toggleUpSideBar}
              >
                Login
              </Link>
              <hr />
            </>
          )}
        </div>
      )}

      {/* Sidebar for larger screens */}
      <Sidebar isOpen={isLeftSideBarOpen} toggleSidebar={toggleLeftSideBar} />
      
    </div>
  );
};

export default Navbar;