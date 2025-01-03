import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpgradeDetails = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(`/api/user/upgrade-requests/${requestId}`);
        setRequest(response.data);
      } catch (error) {
        console.error('Error fetching upgrade request:', error);
      }
    };

    fetchRequest();
  }, [requestId]);

  const handleApprove = async (requestId) => {
    try {
      await axios.post('/api/user/approve-upgrade', { requestId, status: 'approved' });
      setRequest({ ...request, status: 'approved' });
      navigate('/admin/upgrade-requests');
    } catch (error) {
      console.error('Error approving upgrade request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post('/api/user/approve-upgrade', { requestId, status: 'rejected' });
      setRequest({ ...request, status: 'rejected' });
      navigate('/admin/upgrade-requests');
    } catch (error) {
      console.error('Error rejecting upgrade request:', error);
    }
  };

  if (!request) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Upgrade Request Details</h1>
      <div className="mb-4 p-4 bg-white rounded shadow">
        <p><strong>ID Number:</strong> {request.idDetails.idNumber}</p>
        <p><strong>ID Name:</strong> {request.idDetails.idName}</p>
        <p><strong>Note:</strong> {request.note}</p>
        <p><strong>Requested Role:</strong> {request.requestedRole}</p>
        <p><strong>Status:</strong> {request.status}</p>
        <div className="mb-4">
          <p><strong>ID Front Image:</strong></p>
          <img src={request.idFrontImageUrl} alt="ID Front" className="w-64 h-40 object-cover rounded-lg shadow-md" />
        </div>
        <div className="mb-4">
          <p><strong>ID Back Image:</strong></p>
          <img src={request.idBackImageUrl} alt="ID Back" className="w-64 h-40 object-cover rounded-lg shadow-md" />
        </div>
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
      </div>
    </div>
  );
};

export default UpgradeDetails;