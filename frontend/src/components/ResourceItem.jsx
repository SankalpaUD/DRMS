import React from 'react';
import { Link } from 'react-router-dom';

const ResourceItem = ({ resource }) => {
  return (
    <div className="bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden w-full sm:w-[280px] transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <Link to={`/resource/${resource._id}`}>
        <img
          src={
            resource.imageUrl[0] ||
            'https://via.placeholder.com/280x200.png?text=No+Image'
          }
          alt="resource cover"
          className="h-[280px] sm:h-[200px] w-full object-cover hover:scale-105 transition-all duration-300 ease-in-out"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <div className="flex justify-between items-center">
            <p className="truncate text-lg font-semibold text-slate-700">
              {resource.name}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {resource.description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ResourceItem;