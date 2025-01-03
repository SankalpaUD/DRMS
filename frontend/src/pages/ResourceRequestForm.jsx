import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResourceRequestForm = () => {
  const { resourceId } = useParams();
  const [requestDate, setRequestDate] = useState('');
  const [takenTime, setTakenTime] = useState('');
  const [handoverTime, setHandoverTime] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/resource/request',
        { resourceId, requestDate, takenTime, handoverTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      navigate('/profile');
    } catch (error) {
      console.error('Error creating request:', error);
      setMessage('Error creating request');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Request Resource</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requestDate">
            Request Date
          </label>
          <input
            type="date"
            id="requestDate"
            value={requestDate}
            onChange={(e) => setRequestDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="takenTime">
            Taken Time
          </label>
          <input
            type="text"
            id="takenTime"
            value={takenTime}
            onChange={(e) => setTakenTime(e.target.value)}
            placeholder="e.g., 1 PM"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="handoverTime">
            Handover Time
          </label>
          <input
            type="text"
            id="handoverTime"
            value={handoverTime}
            onChange={(e) => setHandoverTime(e.target.value)}
            placeholder="e.g., 2 PM"
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
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </form>
    </div>
  );
};

export default ResourceRequestForm;