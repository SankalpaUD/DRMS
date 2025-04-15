import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Report = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [resources, setResources] = useState([]); // List of resources
  const [selectedResource, setSelectedResource] = useState(''); // Selected resource
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('');
  const [reportedBy, setReportedBy] = useState(currentUser?.name || '');
  const [contactInfo, setContactInfo] = useState(currentUser?.email || '');
  const [message, setMessage] = useState('');
  const [subType, setSubType] = useState(''); // Default value for subType
  const [images, setImages] = useState([]); // State for uploaded images

  // Fetch resources from the backend
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/resource/get', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResources(response.data); // Assuming the API returns an array of resources
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate subType if required
    if ((type === 'damage' || type === 'maintenance') && !subType) {
      setMessage('Please select a valid subType for the selected issue type.');
      return;
    }

    const formData = new FormData();
    formData.append('resourceId', selectedResource);
    formData.append('type', type);
    if (subType) {
      formData.append('subType', subType); // Only append subType if it has a valid value
    }
    formData.append('description', description);
    formData.append('severity', severity);
    formData.append('reportedBy', reportedBy);
    formData.append('contactInfo', contactInfo);
    images.forEach((image) => {
      formData.append('images', image); // Append images to the form data
    });

    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      await axios.post('/api/resource/reportIssue', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Issue reported successfully');
      navigate('/resources'); // Navigate to the resources page
    } catch (error) {
      console.error('Error reporting issue:', error);
      setMessage('Failed to report issue');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Report an Issue</h1>
      {message && <p className="text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resource">
            Select Resource
          </label>
          <select
            id="resource"
            name="resource"
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a Resource</option>
            {resources.map((resource) => (
              <option key={resource._id} value={resource._id}>
                {resource.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
            Issue Type
          </label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select Issue Type</option>
            <option value="damage">Damage</option>
            <option value="maintenance">Maintenance</option>
            <option value="broken">Broken</option>
            <option value="update">Update</option>
            <option value="other">Other</option>
          </select>
        </div>

        {type === 'damage' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subType">
              Damage Type
            </label>
            <select
              id="subType"
              name="subType"
              value={subType}
              onChange={(e) => setSubType(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Damage Type</option>
              <option value="physical">Physical</option>
              <option value="water">Water</option>
              <option value="electrical">Electrical</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        {type === 'maintenance' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subType">
              Maintenance Type
            </label>
            <select
              id="subType"
              name="subType"
              value={subType}
              onChange={(e) => setSubType(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Maintenance Type</option>
              <option value="routine">Routine</option>
              <option value="emergency">Emergency</option>
              <option value="preventive">Preventive</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="severity">
            Severity
          </label>
          <select
            id="severity"
            name="severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select Severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reportedBy">
            Reported By
          </label>
          <input
            type="text"
            id="reportedBy"
            name="reportedBy"
            value={reportedBy}
            onChange={(e) => setReportedBy(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactInfo">
            Contact Info
          </label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">
            Upload Images (Optional)
          </label>
          <input
            type="file"
            id="images"
            name="images"
            multiple
            onChange={handleImageUpload}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {message && <p className="text-green-500">{message}</p>}
        <button
          type="submit"
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Report;