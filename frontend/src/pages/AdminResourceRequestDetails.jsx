import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AdminResourceRequestDetails = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await axios.get(`/api/resource/getRequest/${requestId}`);
        setRequest(response.data);
      } catch (error) {
        console.error('Error fetching request details:', error);
      }
    };

    fetchRequestDetails();
  }, [requestId]);

  const handleApprove = async () => {
    try {
      await axios.put(`/api/resource/approveRequest/${requestId}`);
      setRequest({ ...request, status: 'approved' });
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.put(`/api/resource/rejectRequest/${requestId}`);
      setRequest({ ...request, status: 'rejected' });
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  if (!request) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-slate-100'>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 flex justify-center">Resource Request Details</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p><strong>User:</strong> {request.user?.name || 'N/A'}</p>
        <p><strong>Resource:</strong> {request.resource?.name || 'N/A'}</p>
        <p><strong>Date:</strong> {new Date(request.requestDate).toLocaleDateString()}</p>
        <p><strong>Taken Time:</strong> {request.takenTime}</p>
        <p><strong>Handover Time:</strong> {request.handoverTime}</p>
        <p><strong>Status:</strong> {request.status}</p>
        <p><strong>Reason:</strong> {request.reason}</p>
        <p><strong>Additional Details:</strong> {request.additionalDetails}</p>
        <p><strong>User Role:</strong> {request.userRole}</p>
        {request.userRole === 'user' && <p><strong>User Details:</strong> {request.userDetails}</p>}
        <div className="mt-4 flex justify-end">
          {request.status === 'Pending' && (
            <>
              <button
                onClick={handleApprove}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Approve
              </button>
              <button
                onClick={handleReject}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Reject
              </button>
            </>
          )}
          {request.status === 'approved' && (
            <p className="text-green-500 font-bold">This request has been approved.</p>
          )}
          {request.status === 'rejected' && (
            <p className="text-red-500 font-bold">This request has been rejected.</p>
          )}
        </div>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        Back
      </button>
    </div>
    </div>
  );
};

export default AdminResourceRequestDetails;