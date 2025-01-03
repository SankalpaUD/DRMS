import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpgradeRequestForm = () => {
  const [idNumber, setIdNumber] = useState('');
  const [idName, setIdName] = useState('');
  const [note, setNote] = useState('');
  const [requestedRole, setRequestedRole] = useState('student');
  const [idFrontImage, setIdFrontImage] = useState(null);
  const [idBackImage, setIdBackImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.name === 'idFrontImage') {
      setIdFrontImage(e.target.files[0]);
    } else if (e.target.name === 'idBackImage') {
      setIdBackImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('idNumber', idNumber);
    formData.append('idName', idName);
    formData.append('note', note);
    formData.append('requestedRole', requestedRole);
    formData.append('idFrontImage', idFrontImage);
    formData.append('idBackImage', idBackImage);

    try {
      const response = await axios.post('/api/user/upgrade-request', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/profile');
    } catch (error) {
      console.error('Error submitting upgrade request:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Request Account Upgrade</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idNumber">
            ID Number
          </label>
          <input
            type="text"
            id="idNumber"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idName">
            ID Name
          </label>
          <input
            type="text"
            id="idName"
            value={idName}
            onChange={(e) => setIdName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="note">
            Note
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requestedRole">
            Requested Role
          </label>
          <select
            id="requestedRole"
            value={requestedRole}
            onChange={(e) => setRequestedRole(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="student">Student</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idFrontImage">
            ID Front Image
          </label>
          <input
            type="file"
            id="idFrontImage"
            name="idFrontImage"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idBackImage">
            ID Back Image
          </label>
          <input
            type="file"
            id="idBackImage"
            name="idBackImage"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Pending...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default UpgradeRequestForm;