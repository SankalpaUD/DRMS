import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResourceRequestForm = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const [requestDate, setRequestDate] = useState('');
  const [takenTime, setTakenTime] = useState('08:00');
  const [handoverTime, setHandoverTime] = useState('16:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

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

  const handleTakenTimeChange = (event) => {
    setTakenTime(event.target.value);
  };

  const handleHandoverTimeChange = (event) => {
    setHandoverTime(event.target.value);
  };

  const timeOptions = [];
  for (let hour = 8; hour <= 16; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    timeOptions.push(
      <option key={time} value={time}>
        {time}
      </option>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Request Resource</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Request Date</label>
          <input
            type="date"
            value={requestDate}
            onChange={(e) => setRequestDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Taken Time</label>
          <select
            value={takenTime}
            onChange={handleTakenTimeChange}
            className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          >
            {timeOptions}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Handover Time</label>
          <select
            value={handoverTime}
            onChange={handleHandoverTimeChange}
            className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          >
            {timeOptions}
          </select>
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