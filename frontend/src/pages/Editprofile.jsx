import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../redux/user/userSlice';
import axios from 'axios';

export default function EditProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [address, setAddress] = useState(currentUser.address || '');
  const [description, setDescription] = useState(currentUser.description || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Name is required');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      alert('A valid email is required');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('description', description);
    if (selectedFile) {
      formData.append('avatar', selectedFile);
    }

    try {
      const response = await axios.put(`/api/user/updateuser2/${currentUser._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${currentUser.access_token}`,
        },
      });

      const updatedUser = response.data;
      dispatch(updateProfile(updatedUser));
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should not exceed 2MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center p-5 font-sans bg-slate-100 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-10 mt-20 text-gray-800">Edit Profile</h1>
      <form className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl" onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex items-center mb-6">
            <label htmlFor="avatar" className="text-gray-700 font-semibold mb-2 mr-16">Image</label>
            <div className="flex flex-col items-center">
              <img
                src={avatar || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-20 h-20 rounded-full shadow-lg mb-2"
              />
            </div>
            <div className="ml-4">
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="text-xs h-12"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-gray-700 font-semibold mb-2">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                className="p-2 border rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-700 font-semibold mb-2">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-gray-700 font-semibold mb-2">Phone</label>
            <input
              id="phone"
              type="text"
              value={phone}
              placeholder="Enter your phone number"
              onChange={(e) => setPhone(e.target.value)}
              className="p-2 border rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="address" className="text-gray-700 font-semibold mb-2">Address</label>
            <input
              id="address"
              type="text"
              value={address}
              placeholder="Enter your address"
              onChange={(e) => setAddress(e.target.value)}
              className="p-2 border rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description" className="text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              id="description"
              value={description}
              placeholder="Enter a description"
              onChange={(e) => setDescription(e.target.value)}
              className="p-2 border rounded-lg"
            />
          </div>
        </div>
        <button
          type="submit"
          className={`mt-6 px-4 py-2 rounded-lg shadow transition duration-300 ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}