import React from 'react';

const MostReportedIssues = ({ data }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Most Reported Issues</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Issue Description</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Resource</th>
            <th className="py-2 px-4 border-b border-gray-300 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(issue => (
            <tr key={issue._id}>
              <td className="py-2 px-4 border-b border-gray-300 text-center">{issue.description}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">
                {issue.resourceName}
              </td>
              <td className="py-2 px-4 border-b border-gray-300 text-center">
                {issue.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MostReportedIssues;