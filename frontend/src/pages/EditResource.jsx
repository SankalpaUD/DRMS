import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditResource = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState({
    name: '',
    description: '',
    imageUrl: [],
    availability: true,
    resourceType: 'PremisesResourceType',
    premiType: '',
    capacity: '',
    isAC: false,
    hasWhiteboard: false,
    hasProjector: false,
    hasDesktopOrLaptop: false,
    hasMicrophone: false,
    brand: '',
    model: '',
    quantity: '',
    additionalAttributes: {},
  });
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attributeName, setAttributeName] = useState('');
  const [attributeValue, setAttributeValue] = useState('');

  // Fetch resource details
  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await axios.get(`/api/resource/get/${id}`);
        const resourceData = response.data;
        console.log(resourceData);

        // Initialize additionalAttributes if they don't exist
        const initialAttributes = resourceData.additionalAttributes || {};
        setResource({
          ...resourceData,
          additionalAttributes: initialAttributes,
        });
      } catch (error) {
        setError('Failed to fetch resource details');
      }
    };
    fetchResource();
  }, [id]);

  // Handle image changes
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + resource.imageUrl.length > 6) {
      setImageUploadError('You can only upload up to 6 images.');
      return;
    }
    setFiles(selectedFiles);
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setResource((prev) => ({
      ...prev,
      imageUrl: prev.imageUrl.filter((_, i) => i !== index),
    }));
  };

  // Handle main form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setResource((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle dynamic attributes
  const handleAttributeChange = (key, value) => {
    setResource((prev) => ({
      ...prev,
      additionalAttributes: {
        ...prev.additionalAttributes,
        [key]: value,
      },
    }));
  };

  // Add new dynamic attribute
  const addNewAttribute = () => {
    if (attributeName && attributeValue) {
      handleAttributeChange(attributeName, attributeValue);
      setAttributeName('');
      setAttributeValue('');
    }
  };

  // Remove dynamic attribute
  const removeAttribute = (key) => {
    setResource((prev) => {
      const updated = { ...prev.additionalAttributes };
      delete updated[key];
      return { ...prev, additionalAttributes: updated };
    });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append core fields
    Object.entries(resource).forEach(([key, value]) => {
      if (key === 'additionalAttributes') {
        formData.append(key, JSON.stringify(value)); // Send as JSON string
      } else if (key !== 'imageUrl') {
        formData.append(key, value);
      }
    });

    // Append image files
    files.forEach((file) => formData.append('images', file));

    try {
      setLoading(true);
      setError('');
      const res = await axios.put(`/api/resource/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        navigate(`/resource/${id}`);
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  // Render premises-specific fields
  const renderPremisesDetails = () => {
    if (resource.resourceType !== 'PremisesResourceType') return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Premises Type</label>
            <select
              name="premiType"
              value={resource.premiType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select type</option>
              <option value="Lecture Room">Lecture Room</option>
              <option value="Computer Lab">Computer Lab</option>
              <option value="Auditorium">Auditorium</option>
            </select>
          </div>

          <div>
            <label>Capacity</label>
            <input
              type="number"
              name="capacity"
              value={resource.capacity}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {['isAC', 'hasWhiteboard', 'hasProjector','hasDesktopOrLaptop','hasMicrophone'].map((field) => (
            <label key={field} className="flex items-center gap-2">
              <input
                type="checkbox"
                name={field}
                checked={resource[field]}
                onChange={handleChange}
              />
              {field.replace(/([A-Z])/g, ' $1').trim()}
            </label>
          ))}
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">Additional Attributes</h3>

          {/* Existing attributes */}
          {Object.entries(resource.additionalAttributes).map(([key, value]) => (
            <div key={key} className="flex gap-2 mb-2">
              <input
                type="text"
                value={key}
                disabled
                className="flex-1 p-2 border rounded bg-gray-100"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => handleAttributeChange(key, e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeAttribute(key)}
                className="px-3 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Add new attributes */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              placeholder="Attribute name"
              value={attributeName}
              onChange={(e) => setAttributeName(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Attribute value"
              value={attributeValue}
              onChange={(e) => setAttributeValue(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              onClick={addNewAttribute}
              className="px-4 bg-blue-500 text-white rounded"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAssetDetails = () => {
    if (resource.resourceType !== 'AssetResourceType') return null;
  
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Asset Type</label>
            <select
              name="assetType"
              value={resource.assetType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select asset type</option>
              <option value="Laptop">Laptop</option>
              <option value="Projector">Projector</option>
              <option value="Microphone">Microphone</option>
              <option value="Speaker">Speaker</option>
              <option value="Camera">Camera</option>
            </select>
          </div>
  
          <div>
            <label>Brand</label>
            <input
              type="text"
              name="brand"
              value={resource.brand}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
  
          <div>
            <label>Model</label>
            <input
              type="text"
              name="model"
              value={resource.model}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
  
          <div>
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={resource.quantity}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Resource</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Resource Name</label>
            <input
              type="text"
              name="name"
              value={resource.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label>Resource Type</label>
            <select
              name="resourceType"
              value={resource.resourceType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="PremisesResourceType">Premises</option>
              <option value="AssetResourceType">Asset</option>
            </select>
          </div>
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={resource.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="availability"
              checked={resource.availability}
              onChange={handleChange}
            />
            Available
          </label>
        </div>

        {/* Premises-specific fields */}
        {renderPremisesDetails()}
       {/* Asset-specific fields */}
      {renderAssetDetails()}
       
        {/* Image Upload */}
        <div>
          <label>Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
          {imageUploadError && <p className="text-red-500">{imageUploadError}</p>}

          <div className="grid grid-cols-4 gap-4 mt-4">
            {resource.imageUrl.map((url, index) => (
              <div key={url} className="relative group">
                <img
                  src={url}
                  alt="Resource preview"
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Section */}
        <div className="border-t pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default EditResource;