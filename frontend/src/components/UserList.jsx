import React from 'react';

const UserList = ({ data }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Name</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Email</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Role</th>
          </tr>
        </thead>
        <tbody>
          {data.map(user => (
            <tr key={user._id}>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{user.name}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{user.email}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;