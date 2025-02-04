import React from 'react';

const WebComponents = ({ image, title, link }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative border border-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group w-full max-w-sm bg-white cursor-pointer"
    >
      {/* Blog Image */}
      <img
        className="w-full h-60 object-cover"
        src={image}
        alt={title}
      />

      {/* Static Text Section */}
      <div className="absolute bottom-0 left-0 right-0 bg-white py-4 opacity-100 transition-all duration-300">
        <h3 className="text-black text-2xl font-semibold text-center">{title}</h3>
      </div>
    </a>
  );
};

export default WebComponents;
