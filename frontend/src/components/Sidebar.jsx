import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser, FaCalendarAlt, FaCog, FaSignOutAlt, FaPlus, FaArrowUp, FaClipboardList, FaTable, FaUserPlus, FaUsers } from 'react-icons/fa';
import { logoutSuccess } from '../redux/user/userSlice';

const Sidebar = ({ isOpen }) => {
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

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

  const getLinkClass = (path) => {
    return location.pathname === path
      ? 'text-white text-base font-medium py-2 px-4 mb-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center'
      : 'text-white text-base font-medium py-2 px-4 mb-2 rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out flex items-center';
  };

  return (
    <div className={`fixed top-[65px] left-0 h-[calc(100%-65px)] w-56 bg-indigo-400 shadow-lg flex flex-col items-center py-12 z-20 transition-transform duration-300 rounded-r-xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {currentUser && (
        <div className="flex flex-col items-center mb-6">
          <img 
            src={currentUser.avatar} 
            alt="avatar" 
            className="w-12 h-12 rounded-full mb-2"
            referrerPolicy="no-referrer" 
          />
          <p className="text-white text-lg font-semibold">{currentUser.name}</p>
        </div>
      )}
      <nav className="flex flex-col w-full pr-4">
        <Link 
          to="/profile" 
          className={getLinkClass('/profile')}
        >
          <FaUser className="mr-2" /> Profile
        </Link>
        {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'Resource Admin') && (
          <>
          <Link 
            to="/add-resource" 
            className={getLinkClass('/add-resource')}
          >
            <FaPlus className="mr-2" /> Add Resource
          </Link>
          <Link
            to="/issues"
            className={getLinkClass('/issues')}
            >
              <FaClipboardList className="mr-2" /> Reported Issues
          </Link>
          <Link
            to="/timetable-management"
            className={getLinkClass('/timetable-management')}
            >
              <FaTable className="mr-2" /> Manage Timetable
          </Link>
          </>
        )}
        {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'Acceptance Admin') && (
           <>
          <Link 
            to="/admin/upgrade-requests" 
            className={getLinkClass('/admin/upgrade-requests')}
          >
            <FaArrowUp className="mr-2" /> Upgrade Requests
          </Link>
          <Link 
            to="/admin/resource-requests" 
            className={getLinkClass('/admin/resource-requests')}
          >
            <FaClipboardList className="mr-2" /> Resource Requests
          </Link>
          </>
        )}
         {currentUser && (currentUser.role === 'Fulfillment Admin' || currentUser.role === 'Super Admin') && (
           <>
          <Link 
            to="/show-fulfill-staff" 
            className={getLinkClass('/show-fulfill-staff')}
          >
            <FaUserPlus className="mr-2" /> Manage Fulfill Staff
          </Link>
          </>
        )}
        {currentUser && (currentUser.role === 'Super Admin') && (
           <>
          <Link 
            to="/manage-users" 
            className={getLinkClass('/manage-users')}
          >
            <FaUsers className="mr-2" /> Manage Users
          </Link>
          </>
        )}
        <Link 
          to="/bookings" 
          className={getLinkClass('/bookings')}
        >
          <FaCalendarAlt className="mr-2" /> Bookings
        </Link>
        <Link 
          to="/settings" 
          className={getLinkClass('/settings')}
        >
          <FaCog className="mr-2" /> Settings
        </Link>
        <Link 
          to="/home" 
          className={getLinkClass()}
          onClick={() => {
            handleLogout();
          }}
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </Link>
        {currentUser && currentUser.role === 'user' && (
          <Link 
            to="/upgrade-request" 
            className={getLinkClass('/upgrade-request')}
          >
            <FaArrowUp className="mr-2" /> Upgrade Account
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;