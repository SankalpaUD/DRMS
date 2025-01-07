import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const idDetails = currentUser.idDetails || {};
  const isAdmin = currentUser.role === 'Super Admin' || currentUser.role === 'Resource Admin' || currentUser.role === 'Acceptance Admin';

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/resource/getUserBookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="flex flex-col p-5 font-sans bg-slate-100 min-h-screen w-full items-center">
      <h1 className="text-4xl font-extrabold mb-10 mt-5 text-gray-800">Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-8">
        {/* Profile Picture and Details */}
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center w-full col-span-1 md:col-span-2">
          {/* Avatar */}
          <img
            src={currentUser.avatar}
            alt="Profile"
            className="w-36 h-36 rounded-full shadow-lg overflow-hidden border-4 border-slate-300"
            referrerPolicy="no-referrer"
          />
          {/* Name and Email */}
          <div className="ml-6">
            <h2 className="text-4xl font-semibold text-gray-800 mb-1">{currentUser.name}</h2>
            <p className="text-gray-600 text-md">{currentUser.email}</p>
            <p className="text-gray-600 text-md uppercase">({currentUser.role})</p>
          </div>
          <div className="ml-auto">
            <Link
              to="/edit-profile"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300 whitespace-nowrap"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* User Details */}
        {!isAdmin && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">User Details</h2>
            <p className="text-gray-700 mb-2">ID Number: {idDetails.idNumber || 'Not Given'}</p>
            <p className="text-gray-700 mb-2">ID Name: {idDetails.idName || 'Not Given'}</p>
            <p className="text-gray-700 mb-2">Address: {currentUser.address || 'Not Given'}</p>
            <p className="text-gray-700 mb-2">Phone: {currentUser.phone || 'Not Given'}</p>
            <p className="text-gray-700">Description: {currentUser.description || 'Not Given'}</p>
          </div>
        )}

        {/* Login Activity */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Login Activity</h2>
          <p className="text-gray-700">Last login: {currentUser.lastLogin || 'Not Given'}</p>
          <p className="text-gray-700">Login IP: {currentUser.loginIP || 'Not Given'}</p>
        </div>

        {/* My Bookings */}
        {!isAdmin && (
          <div className="bg-white shadow-md rounded-lg p-6 col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">My Bookings</h2>
            {loading ? (
              <p className="text-gray-700">Loading bookings...</p>
            ) : bookings.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {bookings.map((booking, index) => (
                  <li key={index}>
                    {booking.resource ? booking.resource.name : 'Resource not found'} - {new Date(booking.requestDate).toLocaleDateString()} - Status: {booking.status}

                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No bookings found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;