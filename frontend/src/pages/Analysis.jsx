import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MostBookedResources from '../components/MostBookedResources';
import MostReportedIssues from '../components/MostReportedIssues';
import TopBookers from '../components/TopBookers';
import UserList from '../components/UserList';

const Analysis = () => {
  const [mostBookedResources, setMostBookedResources] = useState([]);
  const [mostReportedIssues, setMostReportedIssues] = useState([]);
  const [topBookers, setTopBookers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [bookedResourcesRes, reportedIssuesRes, topBookersRes, usersRes] = await Promise.all([
          axios.get('/api/analysis/most-booked', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/api/analysis/most-reported', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/api/analysis/top-bookers', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/api/analysis/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        //console.log('Most Booked Resources:', bookedResourcesRes.data);
        //console.log('Most Reported Issues:', reportedIssuesRes.data);
        //console.log('Top Bookers:', topBookersRes.data);
        //console.log('Users:', usersRes.data);

        setMostBookedResources(bookedResourcesRes.data);
        setMostReportedIssues(reportedIssuesRes.data);
        setTopBookers(topBookersRes.data);
        setUsers(usersRes.data.filter(user => !['Fulfillment Admin', 'Acceptance Admin', 'Resource Admin', 'Super Admin'].includes(user.role))); // Filter out specified admin roles
      } catch (error) {
        setError('Error fetching analysis data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-8 sm:p-8">
      <h1 className="mt-1 mb-10 text-4xl font-bold uppercase tracking-wide text-transparent bg-clip-text bg-black text-center">Resource Analysis</h1>
     <div className='container rounded-xl shadow-lg py-4 mb-4'> <MostBookedResources data={mostBookedResources} /></div>
     <div className='container rounded-xl shadow-lg mb-4'> <MostReportedIssues data={mostReportedIssues} /></div>
     <div className='container rounded-xl shadow-lg mb-4'><TopBookers data={topBookers} /></div>
      <div className='container rounded-xl shadow-lg mb-4'><UserList data={users} /></div>
    </div>
  );
};

export default Analysis;