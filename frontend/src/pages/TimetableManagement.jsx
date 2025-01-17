import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TimetableManagement = () => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState('');
  const [timetable, setTimetable] = useState({
    day: '',
    startTime: '',
    endTime: '',
  });
  const [timetables, setTimetables] = useState([]);
  const [editTimetableId, setEditTimetableId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('/api/resource/get');
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    if (selectedResource) {
      const fetchTimetables = async () => {
        try {
          const response = await axios.get(`/api/resource/getTimetables/${selectedResource}`);
          setTimetables(response.data);
        } catch (error) {
          console.error('Error fetching timetables:', error);
        }
      };

      fetchTimetables();
    }
  }, [selectedResource]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTimetable({
      ...timetable,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/resource/addTimetable', {
        resourceId: selectedResource,
        timetable: { ...timetable, isAvailable: false }, // Set isAvailable to false
      });
      alert('Timetable added successfully');
      navigate('/bookings'); // Navigate to bookings page
    } catch (error) {
      console.error('Error adding timetable:', error);
    }
  };

  const handleEdit = (timetable) => {
    setTimetable(timetable);
    setEditTimetableId(timetable._id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/resource/updateTimetable', {
        resourceId: selectedResource,
        timetableId: editTimetableId,
        timetable,
      });
      alert('Timetable updated successfully');
      setEditTimetableId(null);
      setTimetable({ day: '', startTime: '', endTime: '' });
      navigate('/bookings'); // Navigate to bookings page
    } catch (error) {
      console.error('Error updating timetable:', error);
    }
  };

  const handleDelete = async (timetableId) => {
    try {
      await axios.delete(`/api/resource/deleteTimetable/${selectedResource}/${timetableId}`);
      alert('Timetable deleted successfully');
      setTimetables(timetables.filter(t => t._id !== timetableId));
    } catch (error) {
      console.error('Error deleting timetable:', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Timetable Management</h1>
      <form onSubmit={editTimetableId ? handleUpdate : handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
          >
            <option value="">Select a resource</option>
            {resources.map((resource) => (
              <option key={resource._id} value={resource._id}>
                {resource.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="day">
            Day
          </label>
          <select
            id="day"
            name="day"
            value={timetable.day}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={timetable.startTime}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={timetable.endTime}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {editTimetableId ? 'Update Timetable' : 'Add Timetable'}
          </button>
        </div>
      </form>
      <div>
        <h2 className="text-xl font-bold mb-4">Existing Timetables</h2>
        {timetables.map((t) => (
          <div key={t._id} className="mb-4 p-4 border rounded shadow">
            <p><strong>Day:</strong> {t.day}</p>
            <p><strong>Start Time:</strong> {t.startTime}</p>
            <p><strong>End Time:</strong> {t.endTime}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(t)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetableManagement;