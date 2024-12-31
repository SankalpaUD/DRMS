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
    type: '',
    description: '',
    imageUrl: [],
    availability: true,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + formData.imageUrl.length > 6) {
      setImageUploadError('You can only upload up to 6 images.');
      return;
    }
    setFiles(selectedFiles);
    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setFormData({
      ...formData,
      imageUrl: formData.imageUrl.concat(urls),
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrl: formData.imageUrl.filter((_, i) => i !== index),
    });
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [id]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('availability', formData.availability);
    files.forEach(file => {
      formDataToSend.append('images', file);
    });

    try {
      setLoading(true);
      setError(false);
      const res = await axios.post('/api/resource/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${currentUser.access_token}`,
        },
      });
      const data = res.data;
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/resource/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto rounded-xl shadow-lg bg-gradient-to-r from-gray-100 to-gray-200 mt-10">
      <main className="p-4 max-w-5xl mx-auto">
        <h1 className="text-center mt-1 mb-10 text-4xl font-bold uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
          Add Resource
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Resource Details Section */}
          <section className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Resource Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full border p-3 rounded-lg"
                id="name"
                maxLength="62"
                minLength="5"
                required
                onChange={handleChange}
                value={formData.name}
              />
              <input
                type="text"
                placeholder="Type"
                className="w-full border p-3 rounded-lg"
                id="type"
                required
                onChange={handleChange}
                value={formData.type}
              />
              <textarea
                placeholder="Description"
                className="w-full border p-3 rounded-lg"
                id="description"
                required
                onChange={handleChange}
                value={formData.description}
              />
            </div>
          </section>

          {/* Availability Status */}
          <section className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Availability Status
            </h2>
            <div className="flex items-center gap-2 mb-4">
              <label htmlFor="availability" className="block text-lg font-medium text-gray-700">
                Availability
              </label>
              <input
                type="checkbox"
                id="availability"
                checked={formData.availability}
                onChange={handleChange}
                className="mt-1 w-4 h-4"
              />
            </div>
          </section>

          {/* Image Upload */}
          <section className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Upload Images
              <span className="font-normal text-gray-600 ml-2">
                (The first image will be the cover, max 6)
              </span>
            </h2>
            <div className="flex gap-4">
              <input
                onChange={handleImageChange}
                type="file"
                name="images"
                accept="image/*"
                multiple
                className="p-3 border border-gray-400 rounded w-full"
              />
            </div>
            {imageUploadError && (
              <p className="text-red-500 mt-2">{imageUploadError}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              {formData.imageUrl.map((url, index) => (
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
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-500 text-white px-10 py-4 rounded-lg uppercase hover:bg-green-600 shadow-lg transform hover:translate-y-1 w-full flex items-center justify-center mx-auto"
            disabled={loading || uploading}
          >
            {loading ? 'Saving...' : 'Add Resource'}
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      </main>
    </div>
  );
}