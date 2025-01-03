import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('/api/resource/get');
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col items-center p-8">
      <h1 className="text-center mt-1 mb-10 text-4xl font-bold uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
        Resources
      </h1>
      {loading ? (
        <p className="text-blue-500">Loading resources...</p> // Show loading message while fetching data
      ) : (
        resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
            {resources.map(resource => (
              <Link to={`/resource/${resource._id}`} key={resource._id} className="flex flex-col items-start gap-4 p-4 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-black">
                {resource.imageUrl && resource.imageUrl.length > 0 && (
                  <img
                    src={resource.imageUrl[0]}
                    alt={resource.name}
                    className="h-40 w-full object-cover rounded-lg shadow-md"
                  />
                )}
                <div className="flex-1 text-left">
                  <h2 className="text-slate-700 font-bold text-sm">{resource.name}</h2>
                  <p className="text-slate-500 text-xs">{resource.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-red-700 mt-5">No resources found.</p> // Show message if no resources are found
        )
      )}
    </div>
  );
};

export default Resources;