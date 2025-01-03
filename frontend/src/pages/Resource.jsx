import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShare, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Resource = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await axios.get(`/api/resource/get/${id}`);
        setResource(response.data);
      } catch (error) {
        setError('Error fetching resource details');
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  if (loading) {
    return <p className="text-center my-7 text-2xl">Loading...</p>;
  }

  if (error) {
    return <p className="text-center my-7 text-2xl">Something went wrong!</p>;
  }

  return (
    <main className="container mx-auto p-6 md:p-12">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="flex-shrink-0 w-full md:w-1/3 flex mt-14">
          {resource.imageUrl && resource.imageUrl.length > 0 && (
            <img
              src={resource.imageUrl[0]}
              alt={resource.name}
              className="w-64 h-64 object-cover rounded-lg shadow-lg"
            />
          )}
        </div>

        {/* Details Section */}
        <div className="flex-grow md:ml-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{resource.name}</h1>
            <div className="relative">
              <div className="fixed top-[13%] right-[3%] z-10 shadow-md border rounded-full w-12 h-12 flex justify-center items-center bg-white cursor-pointer hover:shadow-lg transition duration-300">
                <FaShare
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 2000);
                  }}
                />
              </div>
              {copied && (
                <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2 shadow-lg">
                  Link copied!
                </p>
              )}
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span
                  className={`text-lg font-semibold ${
                    resource.availability ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {resource.availability ? 'Available' : 'Not Available!!!'}
                </span>
                <p className="text-2xl font-semibold mt-2 text-gray-700">{resource.name}</p>
              </div>
              <button
                onClick={() => navigate(`/request/${resource._id}`)}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg uppercase font-semibold hover:from-blue-600 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 px-6 py-3"
              >
                Request Now
              </button>
            </div>

            <p className="flex items-center gap-3 text-gray-700 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              <span>{resource.location}</span>
            </p>

            <p className="flex items-center gap-3 text-gray-700 text-sm">
              <FaPhone className="text-green-700" />
              <span>{resource.contact}</span>
            </p>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold text-black">Description: </span>
              {resource.description}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Resource;