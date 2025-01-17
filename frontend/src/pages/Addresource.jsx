import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddResource() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: [],
    availability: true,
    resourceType: 'PremisesResourceType', // Default to PremisesResourceType
    premiType: '',
    assetType: '',
    capacity: '',
    isAC: false,
    hasWhiteboard: false,
    hasProjector: false,
    hasDesktopOrLaptop: false,
    hasMicrophone: false,
    brand: '',
    model: '',
    quantity: '',
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      imageUrl: e.target.files,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'imageUrl') {
        for (let i = 0; i < formData.imageUrl.length; i++) {
          formDataToSend.append('images', formData.imageUrl[i]);
        }
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await axios.post('/api/resource/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Resource added successfully');
      navigate('/resources');
    } catch (error) {
      console.error('Error adding resource:', error);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen">
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-7 text-center text-gray-800">Add Resource</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="availability">
            Availability
          </label>
          <input
            type="checkbox"
            id="availability"
            name="availability"
            checked={formData.availability}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
          <span className="text-gray-700">Available</span>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resourceType">
            Resource Type
          </label>
          <select
            id="resourceType"
            name="resourceType"
            value={formData.resourceType}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a resource type</option>
            <option value="PremisesResourceType">Premises Resource</option>
            <option value="AssetResourceType">Asset Resource</option>
          </select>
        </div>
        {formData.resourceType === 'PremisesResourceType' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="premiType">
                Premises Type
              </label>
              <select
                id="premiType"
                name="premiType"
                value={formData.premiType}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select a premises type</option>
                <option value="Lecture Room">Lecture Room</option>
                <option value="Auditorium">Auditorium</option>
                <option value="Mini Auditorium">Mini Auditorium</option>
                <option value="Computer Lab">Computer Lab</option>
                <option value="Discussion Room">Discussion Room</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4 flex flex-wrap">
              <div className="mr-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isAC">
                  Air Conditioning
                </label>
                <input
                  type="checkbox"
                  id="isAC"
                  name="isAC"
                  checked={formData.isAC}
                  onChange={handleChange}
                  className="mr-2 leading-tight"
                />
                <span className="text-gray-700">Yes</span>
              </div>
              <div className="mr-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hasWhiteboard">
                  Whiteboard
                </label>
                <input
                  type="checkbox"
                  id="hasWhiteboard"
                  name="hasWhiteboard"
                  checked={formData.hasWhiteboard}
                  onChange={handleChange}
                  className="mr-2 leading-tight"
                />
                <span className="text-gray-700">Yes</span>
              </div>
              <div className="mr-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hasProjector">
                  Projector
                </label>
                <input
                  type="checkbox"
                  id="hasProjector"
                  name="hasProjector"
                  checked={formData.hasProjector}
                  onChange={handleChange}
                  className="mr-2 leading-tight"
                />
                <span className="text-gray-700">Yes</span>
              </div>
              <div className="mr-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hasDesktopOrLaptop">
                  Desktop/Laptop
                </label>
                <input
                  type="checkbox"
                  id="hasDesktopOrLaptop"
                  name="hasDesktopOrLaptop"
                  checked={formData.hasDesktopOrLaptop}
                  onChange={handleChange}
                  className="mr-2 leading-tight"
                />
                <span className="text-gray-700">Yes</span>
              </div>
              <div className="mr-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hasMicrophone">
                  Microphone
                </label>
                <input
                  type="checkbox"
                  id="hasMicrophone"
                  name="hasMicrophone"
                  checked={formData.hasMicrophone}
                  onChange={handleChange}
                  className="mr-2 leading-tight"
                />
                <span className="text-gray-700">Yes</span>
              </div>
            </div>
          </>
        )}
        {formData.resourceType === 'AssetResourceType' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assetType">
                Asset Type
              </label>
              <select
                id="assetType"
                name="assetType"
                value={formData.assetType}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select an asset type</option>
                <option value="Laptop">Laptop</option>
                <option value="Projector">Projector</option>
                <option value="Microphone">Microphone</option>
                <option value="Speaker">Speaker</option>
                <option value="Camera">Camera</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brand">
                Brand
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model">
                Model
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">
            Images
          </label>
          <input
            type="file"
            id="images"
            name="images"
            multiple
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Resource
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}