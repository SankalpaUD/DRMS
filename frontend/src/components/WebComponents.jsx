import React from 'react';

const WebComponents = ({ image, title, link }) => {

  return (
    <div className="relative border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group w-full max-w-md">
      {/* Blog Image */}
      <img
        className="w-full h-60 object-cover hover:scale-105 transition duration-300"
        src={image}
        alt={title}
      />

      {/* Static Text Section */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/10 backdrop-blur-md py-10 opacity-100 translate-y-2 group-hover:opacity-0 group-hover:translate-y-0 transition-all duration-300">
        <h3 className="text-white text-4xl font-semibold text-center">{title}</h3>
      </div>

      {/* Hover Effect Section with Smooth py Animation */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/10 backdrop-blur-md opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-in-out">
        <div className="py-10 group-hover:py-20 transition-all duration-500 ease-in-out">
          <h3 className="text-white text-4xl font-semibold text-center">
            <a href={link} className="hover:text-orange-400">
              {title}
            </a>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default WebComponents;
