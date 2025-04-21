import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const AdminResourceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [viewAll, setViewAll] = useState(false);
  const [conflictFilter, setConflictFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/resource/getRequest');
        setRequests(response.data);
        setFilteredRequests(response.data);
      } catch (error) {
        console.error('Error fetching resource requests:', error);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [roleFilter, statusFilter, dateFilter, timeFilter, conflictFilter, requests, viewAll]);

  const filterRequests = () => {
    let filtered = [...requests];

    if (!viewAll) {
      filtered = filtered.filter(request => new Date(request.requestDate) >= new Date());
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(request => request.userRole === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(request => new Date(request.requestDate).toLocaleDateString() === new Date(dateFilter).toLocaleDateString());
    }

    if (timeFilter) {
      filtered = filtered.filter(request => request.takenTime === timeFilter);
    }

    if (conflictFilter === 'conflicts') {
      filtered = checkConflicts(filtered);
    }

    setFilteredRequests(filtered);
  };

  const checkConflicts = (requestsToCheck) => {
    const conflicts = [];
    const groupedRequests = {};

    // Group requests by resource name, date, and time
    requestsToCheck.forEach((request) => {
      const key = `${request.resource?.name || 'N/A'}_${new Date(request.requestDate).toLocaleDateString()}_${request.takenTime}`;
      if (!groupedRequests[key]) {
        groupedRequests[key] = [];
      }
      groupedRequests[key].push(request);
    });

    // Identify conflicts within each group
    Object.values(groupedRequests).forEach((group) => {
      if (group.length > 1) {
        conflicts.push(...group);
      }
    });

    return conflicts;
  };

  const sortByPriority = (requestsToSort) => {
    const priorityOrder = { staff: 1, student: 2, user: 3 };

    return [...requestsToSort].sort((a, b) => {
      const priorityA = priorityOrder[a.userRole] || 4; // Default to lowest priority if role is missing
      const priorityB = priorityOrder[b.userRole] || 4;
      return priorityA - priorityB;
    });
  };

  const handleViewDetails = (requestId) => {
    navigate(`/admin/resource-requests/${requestId}`);
  };

  const handleDelete = async (requestId) => {
    try {
      await axios.delete(`/api/resource/deleteRequest/${requestId}`);
      setRequests(requests.filter(request => request._id !== requestId));
    } catch (error) {
      console.error('Error deleting resource request:', error);
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 19; hour++) {
      const timeString = `${hour}:00`;
      times.push(timeString);
    }
    return times;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Resource Requests</h1>
      <div className="mb-4">
        <label className="mr-2">Role:</label>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="mr-4">
          <option value="all">All</option>
          <option value="user">User</option>
          <option value="student">Student</option>
          <option value="staff">Staff</option>
        </select>
        <label className="mr-2">Status:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="mr-4">
          <option value="all">All</option>
          <option value="Pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <label className="mr-2">Date:</label>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="mr-4" />
        <label className="mr-2">Time:</label>
        <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="mr-4">
          <option value="">All</option>
          {generateTimeOptions().map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
        <label className="mr-2">Conflicts:</label>
        <select value={conflictFilter} onChange={(e) => setConflictFilter(e.target.value)} className="mr-4">
          <option value="all">All</option>
          <option value="conflicts">Conflicts</option>
        </select>
        <button
          onClick={() => setViewAll(!viewAll)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
        >
          {viewAll ? 'View Upcoming' : 'View All'}
        </button>
        <button
          onClick={() => setFilteredRequests(sortByPriority(filteredRequests))}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Check Priority
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-300 text-center">User</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Resource</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Date</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Taken Time</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Handover Time</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Status</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map(request => (
            <tr key={request._id}>
              <td className="py-2 px-4 border-b border-gray-300 text-center">
                {request.user?.name ? `${request.user.name} (${request.userRole || 'N/A'})` : 'N/A'}
              </td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{request.resource?.name || 'N/A'}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{new Date(request.requestDate).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{request.takenTime}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{request.handoverTime}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{request.status}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">
                <button
                  onClick={() => handleViewDetails(request._id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDelete(request._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminResourceRequests;