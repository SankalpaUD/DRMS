import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.get('/api/user/getusers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      alert('Error fetching users');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      await axios.delete(`/api/user/deleteuser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      alert('Error deleting user');
    }
  };

  const handleEdit = (user) => {
    navigate('/edit-user', { state: { user } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <Link to="/add-user" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
        Add User
      </Link>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Name</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Email</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Role</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{user.name}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{user.email}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{user.role}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
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

export default ManageUsers;