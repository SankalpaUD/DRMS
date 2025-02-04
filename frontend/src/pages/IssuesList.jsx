import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const IssuesList = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState({
    Damage: false,
    Maintenance: false,
    Other: false,
  });

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get('/api/resource/getIssues');
        setIssues(response.data);
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleTypeChange = (e) => {
    const { name, checked } = e.target;
    setSelectedTypes((prevSelectedTypes) => ({
      ...prevSelectedTypes,
      [name]: checked,
    }));
  };

  const isAnyTypeSelected = Object.values(selectedTypes).some((value) => value);
  const filteredIssues = isAnyTypeSelected
    ? issues.filter((issue) => selectedTypes[issue.type])
    : issues;

  return (
    <div className="bg-slate-100 min-h-screen">
    <div className="container mx-auto px-12 py-8">
      <h1 className="text-2xl font-bold mb-4">Reported Issues</h1>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="Damage"
            checked={selectedTypes.Damage}
            onChange={handleTypeChange}
            className="form-checkbox"
          />
          <span className="ml-2">Damage</span>
        </label>
        <label className="inline-flex items-center ml-4">
          <input
            type="checkbox"
            name="Maintenance"
            checked={selectedTypes.Maintenance}
            onChange={handleTypeChange}
            className="form-checkbox"
          />
          <span className="ml-2">Maintenance</span>
        </label>
        <label className="inline-flex items-center ml-4">
          <input
            type="checkbox"
            name="Other"
            checked={selectedTypes.Other}
            onChange={handleTypeChange}
            className="form-checkbox"
          />
          <span className="ml-2">Other</span>
        </label>
      </div>
      {loading ? (
        <p>Loading issues...</p>
      ) : filteredIssues.length > 0 ? (
        <ul className="space-y-4">
          {filteredIssues.map((issue) => (
            <li key={issue._id} className="bg-white p-4 rounded-lg shadow">
                <p><strong>Resource:</strong> {issue.resource ? issue.resource.name : 'Resource has been deleted'}</p>
                <p><strong>User:</strong> {issue.user ? issue.user.name : 'User not available'}</p>
                <p><strong>Type:</strong> {issue.type || 'Type not specified'}</p>
                <p><strong>Description:</strong> {issue.description || 'No description provided'}</p>
                <p><strong>Status:</strong> {issue.status || 'Status not available'}</p>
                <p><strong>Feedback:</strong> {issue.feedback || 'No feedback yet'}</p>
              {issue.status === 'Pending' && (
                <Link to={`/issue-feedback/${issue._id}`} className="text-blue-500 hover:underline">Provide Feedback</Link>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No issues reported.</p>
      )}
    </div>
    </div>
  );
};

export default IssuesList;