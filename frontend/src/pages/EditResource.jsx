import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditResource = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState({
    name: '',
    type: '',
    description: '',
    availability: true,
    imageUrl: [],
  });
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await axios.get(`/api/resource/get/${id}`);
        setResource(response.data);
      } catch (error) {
        console.error('Error fetching resource:', error);
      }
    };

    fetchResource();
  }, [id]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + resource.imageUrl.length > 6) {
      setImageUploadError('You can only upload up to 6 images.');
      return;
    }
    setFiles(selectedFiles);
    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setResource({
      ...resource,
      imageUrl: resource.imageUrl.concat(urls),
    });
  };

  const handleRemoveImage = (index) => {
    setResource({
      ...resource,
      imageUrl: resource.imageUrl.filter((_, i) => i !== index),
    });
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResource((prevResource) => ({
      ...prevResource,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', resource.name);
    formDataToSend.append('type', resource.type);
    formDataToSend.append('description', resource.description);
    formDataToSend.append('availability', resource.availability);
    files.forEach(file => {
      formDataToSend.append('images', file);
    });

    try {
      setLoading(true);
      setError(false);
      const res = await axios.put(`/api/resource/update/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = res.data;
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        setResource(data.resource); // Update the state with the updated resource
        navigate(`/resource/${id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Resource</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={resource.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">Type</label>
          <input
            type="text"
            name="type"
            value={resource.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={resource.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700">Availability</label>
          <select
            name="availability"
            value={resource.availability}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value={true}>Available</option>
            <option value={false}>Not Available</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Upload Images</label>
          <input
            onChange={handleImageChange}
            type="file"
            name="images"
            accept="image/*"
            multiple
            className="p-3 border border-gray-400 rounded w-full"
          />
          {imageUploadError && (
            <p className="text-red-500 mt-2">{imageUploadError}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {resource.imageUrl.map((url, index) => (
              <div
                key={url}
                className="relative flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="uploaded"
                  className="w-20 h-20 object-cover rounded-md"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg uppercase font-semibold hover:bg-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 px-6 py-3"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default EditResource;