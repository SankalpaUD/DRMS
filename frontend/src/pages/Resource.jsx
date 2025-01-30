import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaShare, FaEdit, FaTrash } from 'react-icons/fa';

const Resource = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await axios.get(`/api/resource/get/${id}`);
        setResource(response.data);
        console.log(response.data);//newly added to check the response data
        
      } catch (error) {
        setError("Error fetching resource details");
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/resource/delete/${resource._id}`);
      navigate("/resources"); // Redirect to resources page after deletion
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  if (loading) {
    return <p className="text-center my-7 text-2xl">Loading...</p>;
  }

  if (error) {
    return <p className="text-center my-7 text-2xl">Something went wrong!</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-100">
      <main className="container mx-auto p-6 md:p-12">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="flex-shrink-0 w-full md:w-1/3 flex mt-14">
            {resource.imageUrl && resource.imageUrl.length > 0 && (
              <img
                src={resource.imageUrl[0]}
                alt={resource.name}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            )}
          </div>

          {/* Details Section */}
          <div className="flex-grow md:ml-4 relative">
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
            <div className="bg-white shadow-xl rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <span
                    className={`text-lg font-semibold ${
                      resource.availability ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {resource.availability ? "Available" : "Not Available!!!"}
                  </span>
                  <p className="text-2xl font-semibold mt-2 text-gray-700">
                    {resource.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!currentUser) {
                      navigate("/login");
                    } else {
                      navigate(`/request/${resource._id}`);
                    }
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg uppercase font-semibold hover:from-blue-600 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 px-6 py-3"
                >
                  Request Now
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed mt-4 text-justify w-4/5">
                <span className="font-semibold text-black">Description: </span>
                {resource.description}
              </p>

             {/* Common Attributes (original ones) */}
{resource.resourceType === 'PremisesResourceType' && (
  <>
    <p className="text-gray-700 leading-relaxed mt-4">
      <span className="font-semibold text-black">Capacity: </span>
      {resource.capacity}
    </p>
    <p className="text-gray-700 leading-relaxed mt-4">
      <span className="font-semibold text-black">Air Conditioning: </span>
      {resource.isAC ? 'Yes' : 'No'}
    </p>
    <p className="text-gray-700 leading-relaxed mt-4">
      <span className="font-semibold text-black">Whiteboard: </span>
      {resource.hasWhiteboard ? 'Yes' : 'No'}
    </p>
    <p className="text-gray-700 leading-relaxed mt-4">
      <span className="font-semibold text-black">Projector: </span>
      {resource.hasProjector ? 'Yes' : 'No'}
    </p>
    <p className="text-gray-700 leading-relaxed mt-4">
      <span className="font-semibold text-black">Desktop or Laptop: </span>
      {resource.hasDesktopOrLaptop ? 'Yes' : 'No'}
    </p>
    <p className="text-gray-700 leading-relaxed mt-4">
      <span className="font-semibold text-black">Microphone: </span>
      {resource.hasMicrophone ? 'Yes' : 'No'}
    </p>
  </>
)}

{/* Additional Attributes for Asset Resources */}
{resource.resourceType === 'AssetResourceType' && (
  <>
    <p className="text-gray-700 leading-relaxed mt-4">
      <span className="font-semibold text-black">Brand: </span>
      {resource.brand}
    </p>
    <p className="text-gray-700 leading-relaxed mt-4">
      <span className="font-semibold text-black">Model: </span>
      {resource.model}
    </p>
    <p className="text-gray-700 leading-relaxed mt-4">
      <span className="font-semibold text-black">Quantity: </span>
      {resource.quantity}
    </p>
  </>
)}

{Object.entries(resource).map(([key, value]) => {

const capitalizeFirstLetter = (str) => {
  if (!str) return str; // If the string is empty or undefined
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
  const excludedFields = [
    "_id",
    "name",
    "imageUrl",
    "description",
    "availability",
    "resourceType",
    "capacity", // Exclude common attributes
    "isAC",
    "hasWhiteboard",
    "hasProjector",
    "hasDesktopOrLaptop",
    "hasMicrophone",
    "brand",
    "model",
    "quantity",
    "resourceType",
    "premiType",
    "createdAt",
    "updatedAt",
    "__v",
    "timetable",
    "assetType"
  ];

  if (!excludedFields.includes(key)) {
    // Capitalize the first letter of the key and leave the rest in lowercase
    let formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) =>
      capitalizeFirstLetter(str) // Capitalize only the first letter of key
    );

    // Check for object or array values and display accordingly
    let formattedValue;
    if (typeof value === "object" && !Array.isArray(value)) {
      formattedValue = Object.entries(value).map(([subKey, subValue]) => {
        return (
          <div key={subKey} className="text-gray-700 leading-relaxed mt-2">
            <span className="font-semibold text-black">{capitalizeFirstLetter(subKey)}: </span> {/* Capitalize subKey */}
            {subValue}
          </div>
        );
      });
    } else if (Array.isArray(value)) {
      formattedValue = value.join(", "); // For arrays, join the elements with commas
    } else {
      formattedValue = value.toString(); // Convert to string if it's a primitive value
    }

    return (
      <p key={key} className="text-gray-700 leading-relaxed mt-4 ">
        <span className="font-semibold text-black ">{formattedKey}: </span>
        {formattedValue}
      </p>
    );
  }

  return null;
})}


              {/* Report Issue Button */}
              {currentUser &&
                (currentUser.role === "user" ||
                  currentUser.role === "student" ||
                  currentUser.role === "staff") && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate(`/report-issue/${resource._id}`)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300 mt-4"
                    >
                      Report Issue
                    </button>
                  </div>
                )}

              {/* Admin Buttons */}
              {currentUser &&
                (currentUser.role === "Super Admin" ||
                  currentUser.role === "Resource Admin") && (
                  <div className="flex justify-end space-x-4 mt-12">
                    <button
                      onClick={() => navigate(`/edit-resource/${resource._id}`)}
                      className="bg-yellow-500 text-white rounded-lg uppercase font-semibold hover:bg-yellow-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 px-6 py-3"
                    >
                      <FaEdit className="inline mr-2" /> Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-500 text-white rounded-lg uppercase font-semibold hover:bg-red-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 px-6 py-3"
                    >
                      <FaTrash className="inline mr-2" /> Delete
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Resource;




