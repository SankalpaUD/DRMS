import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ShowFulfillStaff = () => {
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.get('/api/resource/getFulfillstaffs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(response.data);
    } catch (error) {
      alert('Error fetching fulfill staff');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      await axios.delete(`/api/resource/deleteFulfillstaff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStaff(); // Refresh the list after deletion
    } catch (error) {
      alert('Error deleting fulfill staff');
    }
  };

  const handleEdit = (staff) => {
    navigate('/edit-fulfill-staff', { state: { staff } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Fulfill Staff</h1>
      <Link
        to="/add-fulfill-staff"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block"
      >
        Add Fulfill Staff
      </Link>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Name</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Staff ID</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Email</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Position</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Number</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((staffMember) => (
            <tr key={staffMember._id}>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{staffMember.name}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{staffMember.staffId}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{staffMember.email}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{staffMember.position}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{staffMember.number}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">
              <a
                href={`mailto:${staffMember.email}?subject=Admin Resource Allocation`}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
              >
              Send Mail
              </a>
                <button
                  onClick={() => handleEdit(staffMember)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(staffMember._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowFulfillStaff;