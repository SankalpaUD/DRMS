import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminUpgradeRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/user/upgrade-requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching upgrade requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (requestId, idNumber, idName, requestedRole) => {
    try {
      const response = await axios.post('/api/user/approve-upgrade', {
        requestId,
        status: 'approved',
        role: requestedRole,
        idNumber,
        idName,
      });
      setRequests(requests.filter(request => request._id !== requestId));
    } catch (error) {
      console.error('Error approving upgrade request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post('/api/user/approve-upgrade', { requestId, status: 'rejected' });
      setRequests(requests.filter(request => request._id !== requestId));
    } catch (error) {
      console.error('Error rejecting upgrade request:', error);
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.requestedRole === filter;
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Upgrade Requests</h1>
      <div className="mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`mr-2 px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('student')}
          className={`mr-2 px-4 py-2 rounded ${filter === 'student' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Student Requests
        </button>
        <button
          onClick={() => setFilter('staff')}
          className={`px-4 py-2 rounded ${filter === 'staff' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Staff Requests
        </button>
      </div>
      {filteredRequests.length === 0 ? (
        <p>No upgrade requests available.</p>
      ) : (
        <ul>
          {filteredRequests.map(request => (
            <li key={request._id} className="mb-4 p-4 bg-white rounded shadow">
              <p><strong>ID Number:</strong> {request.idDetails.idNumber}</p>
              <p><strong>ID Name:</strong> {request.idDetails.idName}</p>
              <p><strong>Note:</strong> {request.note}</p>
              <p><strong>Requested Role:</strong> {request.requestedRole}</p>
              <p><strong>Status:</strong> {request.status}</p>
              <div className="flex space-x-4 mt-2">
                <Link
                  to={`/admin/upgrade-requests/${request._id}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  View Details
                </Link>
                <button
                  onClick={() =>
                    handleApprove(request._id, request.idDetails.idNumber, request.idDetails.idName, request.requestedRole)
                  }
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminUpgradeRequests;