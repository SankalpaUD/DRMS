import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminResourceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/resource/getRequest');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching resource requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      await axios.put(`/api/resource/approveRequest/${requestId}`, { status: 'approved' });
      setRequests(requests.filter(request => request._id !== requestId));
    } catch (error) {
      console.error('Error approving resource request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.put(`/api/resource/approveRequest/${requestId}`, { status: 'rejected' });
      setRequests(requests.filter(request => request._id !== requestId));
    } catch (error) {
      console.error('Error rejecting resource request:', error);
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Resource Requests</h1>
      <div className="mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`mr-2 px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`mr-2 px-4 py-2 rounded ${filter === 'approved' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`mr-2 px-4 py-2 rounded ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded ${filter === 'rejected' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Rejected
        </button>
      </div>
      {filteredRequests.length === 0 ? (
        <p>No resource requests available.</p>
      ) : (
        <ul>
          {filteredRequests.map(request => (
            <li key={request._id} className="mb-4 p-4 bg-white rounded shadow">
              <p><strong>Resource Name:</strong> {request.resource?.name || 'N/A'}</p>
              <p><strong>User:</strong> {request.user?.name || 'N/A'}</p>
              <p><strong>Request Date:</strong> {new Date(request.requestDate).toLocaleDateString()}</p>
              <p><strong>Taken Time:</strong> {request.takenTime}</p>
              <p><strong>Handover Time:</strong> {request.handoverTime}</p>
              <p><strong>Status:</strong> {request.status}</p>
              <div className="flex space-x-4 mt-2">
                <button
                  onClick={() => handleApprove(request._id)}
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

export default AdminResourceRequests;