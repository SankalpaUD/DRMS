import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Setting = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    try {
      const response = await axios.post(
        `/api/user/change-password/${currentUser._id}`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${currentUser.access_token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess('Password changed successfully');
        setError('');
      }
    } catch (error) {
      setError('Error changing password');
      setSuccess('');
    }
  };

  return (
    <div className="flex flex-col items-center p-5 font-sans bg-slate-100 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-10 mt-20 text-gray-800">Settings</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4/5">
        <div className="mb-6">
          <button
            onClick={() => setActiveSection('changePassword')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300"
          >
            Change Password
          </button>
          {/* Add more buttons for other operations here */}
        </div>

        {activeSection === 'changePassword' && (
          <form onSubmit={handleChangePassword}>
            <div className="mb-6">
              <label className="text-gray-700 font-semibold mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="p-2 border rounded-lg w-full"
                required
              />
            </div>
            <div className="mb-6">
              <label className="text-gray-700 font-semibold mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="p-2 border rounded-lg w-full"
                required
              />
            </div>
            <div className="mb-6">
              <label className="text-gray-700 font-semibold mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="p-2 border rounded-lg w-full"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <button
              type="submit"
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300"
            >
              Change Password
            </button>
          </form>
        )}

        {/* Add more sections for other operations here */}
      </div>
    </div>
  );
};

export default Setting;