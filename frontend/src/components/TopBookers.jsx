import React from 'react';

const TopBookers = ({ data }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Top Bookers</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Name</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Email</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Role</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Booking Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map(booker => (
            <tr key={booker._id}>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{booker.user.name}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{booker.user.email}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{booker.user.role}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{booker.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopBookers;