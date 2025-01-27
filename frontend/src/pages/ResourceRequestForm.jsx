import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ResourceRequestForm = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const { resourceName, resourceId } = location.state || {};
  const [formData, setFormData] = useState({
    resource: resourceId || '',
    resourceName: resourceName || '',
    requestDate: '',
    takenTime: '8:00',
    handoverTime: '9:00',
    reason: '',
    additionalDetails: '',
    userRole: currentUser?.role || 'student',
    userDetails: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timetable, setTimetable] = useState([]);
  const [conflictMessage, setConflictMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userRole: currentUser.role,
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (formData.resource) {
        try {
          const response = await axios.get(`/api/resource/getTimetables/${formData.resource}`);
          setTimetable(response.data);
        } catch (error) {
          console.error('Error fetching timetable:', error);
        }
      }
    };

    fetchTimetable();
  }, [formData.resource]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      if (name === 'takenTime') {
        const takenHour = parseInt(value.split(':')[0], 10);
        return {
          ...prevFormData,
          [name]: value,
          handoverTime: `${takenHour + 1}:00`,
        };
      }
      return { ...prevFormData, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      await axios.post('/api/resource/request', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Resource request created successfully');
      navigate('/resources'); // Navigate to the resources page
    } catch (error) {
      alert('Error creating resource request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeOptions = Array.from({ length: 11 }, (_, i) => (
    <option key={i} value={`${i + 8}:00`}>{`${i + 8}:00`}</option>
  ));

  const getFilteredHandoverTimeOptions = () => {
    const takenHour = parseInt(formData.takenTime.split(':')[0], 10);
    return Array.from({ length: 11 - (takenHour - 8) }, (_, i) => (
      <option key={i} value={`${i + takenHour + 1}:00`}>{`${i + takenHour + 1}:00`}</option>
    ));
  };

  const checkForConflicts = () => {
    const selectedDay = new Date(formData.requestDate).toLocaleString('en-us', { weekday: 'long' });
    const conflict = timetable.some(t => 
      t.day === selectedDay && 
      ((formData.takenTime >= t.startTime && formData.takenTime < t.endTime) || 
       (formData.handoverTime > t.startTime && formData.handoverTime <= t.endTime))
    );

    if (conflict) {
      setConflictMessage('Scheduled lecture cannot request');
    } else {
      setConflictMessage('');
    }
  };

  useEffect(() => {
    if (formData.requestDate && formData.takenTime && formData.handoverTime) {
      checkForConflicts();
    }
  }, [formData.requestDate, formData.takenTime, formData.handoverTime]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Request Resource</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resource">
            Resource
          </label>
          <input
            type="text"
            name="resourceName"
            id="resourceName"
            value={formData.resourceName}
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requestDate">
            Request Date
          </label>
          <input
            type="date"
            name="requestDate"
            id="requestDate"
            value={formData.requestDate}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="takenTime">
            Taken Time
          </label>
          <select
            name="takenTime"
            id="takenTime"
            value={formData.takenTime}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          >
            {timeOptions}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="handoverTime">
            Handover Time
          </label>
          <select
            name="handoverTime"
            id="handoverTime"
            value={formData.handoverTime}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          >
            {getFilteredHandoverTimeOptions()}
          </select>
        </div>
        {conflictMessage && (
          <div className="mb-4 text-red-500">
            {conflictMessage}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
            Reason
          </label>
          <textarea
            name="reason"
            id="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="additionalDetails">
            Additional Details
          </label>
          <textarea
            name="additionalDetails"
            id="additionalDetails"
            value={formData.additionalDetails}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userRole">
            User Role
          </label>
          <input
            type="text"
            name="userRole"
            id="userRole"
            value={formData.userRole}
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed"
          />
        </div>
        {formData.userRole === 'user' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userDetails">
              User Details
            </label>
            <textarea
              name="userDetails"
              id="userDetails"
              value={formData.userDetails}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting || conflictMessage ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting || conflictMessage}
        >
          {isSubmitting ? 'Pending...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default ResourceRequestForm; 