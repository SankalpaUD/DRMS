import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const IssuesList = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState({
    damage: false,
    maintenance: false,
    broken: false,
    update: false,
    other: false,
  });
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get('/api/resource/getIssues');
        setIssues(response.data);
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleTypeChange = (e) => {
    const { name, checked } = e.target;
    setSelectedTypes((prevSelectedTypes) => ({
      ...prevSelectedTypes,
      [name]: checked,
    }));
  };

  const isAnyTypeSelected = Object.values(selectedTypes).some((value) => value);
  const filteredIssues = isAnyTypeSelected
    ? issues.filter((issue) => selectedTypes[issue.type])
    : issues;

  const handleImageClick = (image) => {
    setSelectedImage(image); // Set the clicked image as the selected image
  };

  const closeModal = () => {
    setSelectedImage(null); // Clear the selected image to close the modal
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-12 py-8">
        <h1 className="text-2xl font-bold mb-4">Reported Issues</h1>
        <div className="mb-4">
          {/* Checkboxes for filtering by issue type */}
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="damage"
              checked={selectedTypes.damage}
              onChange={handleTypeChange}
              className="form-checkbox"
            />
            <span className="ml-2">Damage</span>
          </label>
          <label className="inline-flex items-center ml-4">
            <input
              type="checkbox"
              name="maintenance"
              checked={selectedTypes.maintenance}
              onChange={handleTypeChange}
              className="form-checkbox"
            />
            <span className="ml-2">Maintenance</span>
          </label>
          <label className="inline-flex items-center ml-4">
            <input
              type="checkbox"
              name="broken"
              checked={selectedTypes.broken}
              onChange={handleTypeChange}
              className="form-checkbox"
            />
            <span className="ml-2">Broken</span>
          </label>
          <label className="inline-flex items-center ml-4">
            <input
              type="checkbox"
              name="update"
              checked={selectedTypes.update}
              onChange={handleTypeChange}
              className="form-checkbox"
            />
            <span className="ml-2">Update</span>
          </label>
          <label className="inline-flex items-center ml-4">
            <input
              type="checkbox"
              name="other"
              checked={selectedTypes.other}
              onChange={handleTypeChange}
              className="form-checkbox"
            />
            <span className="ml-2">Other</span>
          </label>
        </div>
        {loading ? (
          <p>Loading issues...</p>
        ) : filteredIssues.length > 0 ? (
          <ul className="space-y-4">
            {filteredIssues.map((issue) => (
              <li key={issue._id} className="bg-white p-4 rounded-lg shadow">
                <p><strong>Resource:</strong> {issue.resource ? issue.resource.name : 'Resource has been deleted'}</p>
                <p><strong>User:</strong> {issue.user ? issue.user.name : 'User not available'}</p>
                <p><strong>Type:</strong> {issue.type || 'Type not specified'}</p>
                <p><strong>SubType:</strong> {issue.subType || 'No subtype provided'}</p>
                <p><strong>Description:</strong> {issue.description || 'No description provided'}</p>
                <p><strong>Severity:</strong> {issue.severity || 'Severity not specified'}</p>
                <p><strong>Status:</strong> {issue.status || 'Status not available'}</p>
                <p><strong>Feedback:</strong> {issue.feedback || 'No feedback yet'}</p>
                {issue.images && issue.images.length > 0 && (
                  <div className="mt-4">
                    <strong>Images:</strong>
                    <div className="flex space-x-4 mt-2">
                      {issue.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Issue Image ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-lg shadow cursor-pointer"
                          onClick={() => handleImageClick(image)} // Open modal on click
                        />
                      ))}
                    </div>
                  </div>
                )}
                {issue.status === 'Pending' && (
                  <Link to={`/issue-feedback/${issue._id}`} className="text-blue-500 hover:underline mt-2 block">
                    Provide Feedback
                  </Link>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No issues reported.</p>
        )}
      </div>

      {/* Modal for Zooming Image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal} // Close modal when clicking outside the image
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Zoomed Issue"
              className="max-w-full max-h-screen rounded-lg shadow-lg"
            />
            <button
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2"
              onClick={closeModal} // Close modal on button click
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuesList;