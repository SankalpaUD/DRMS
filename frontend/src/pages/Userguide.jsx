import React from 'react';
import { Link } from 'react-router-dom';
import signup from '../assets/signup.png';
import signup2 from '../assets/signup2.png';
import login from '../assets/login.png';
import login2 from '../assets/login2.png';
import resources from '../assets/resources.png';
import resources2 from '../assets/resources2.png';
import select1 from '../assets/select1.png';
import select2 from '../assets/select2.png';
import req1 from '../assets/req1.png';
import req2 from '../assets/req2.png';
import booking1 from '../assets/booking1.png';
import booking2 from '../assets/booking2.png';
import FAQ from '../components/FAQ';


const guide = [
  {
    id: 1,
    topic: 'Sign-Up',
    img: signup2,
    hoverImg: signup,
    name: 'Sign up for an account:',
    maintopic: 'Sign Up',
    description: 'click  the "Sign Up" button on the top right corner of homepage.',
  },
  {
    id: 2,
    topic: 'Log in',
    img: login,
    hoverImg: login2,
    name: 'Log In to your account:',
    maintopic: 'Log In',
    description: 'Click  the "Log In" button on the top right corner of homepage and Log in to your account using your email and password.',
  },
  {
    id: 3,
    topic: 'Checking Resources ',
    img: resources,
    hoverImg: resources2,
    name: 'Navigate to resource page',
    maintopic: 'Checking Resources',
    description: 'Navigate to the "Resources" page to view available resources.',
  },
  {
    id: 4,
    topic: 'Selecting the Resources',
    img: select1,
    hoverImg: select2,
    name: 'Select the Resource:',
    maintopic: 'Selecting the Resources',
    description: 'Select a resource and click on "Request Now" to book it.',
  },
  {
    id: 5,
    topic: 'Requesting the Resources',
    img: req1,
    hoverImg: req2,
    name: 'Requesting the Resources:',
    maintopic: 'Requesting the Resources',
    description: 'Fill the required details and submit your request.',
  },
  {
    id: 6,
    topic: 'Check the Bookings',
    img: booking1,
    hoverImg: booking2,
    name: 'Check the Bookings:',
    maintopic: 'Check the Bookings',
    description: 'Check the bookings by visiting "Bookings" page.',
  }
];

const UserGuide  = () => {
  return (
    
    <div className="p-8 bg-slate-100 min-h-screen">
         
         <section className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center">Introduction</h1>
          <p className="text-gray-700 text-center">
            Welcome to the ResourceFlow User Guide. This guide will help you understand how to use the platform effectively to manage and book resources.
          </p>
        </section>
        <div className="my-8"></div>
        <section className="bg-white shadow-md rounded-lg p-6 ">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center">Step-by-Step Instructions</h1>
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {guide.map((guide) => (
          <div key={guide.id} className="group relative overflow-hidden rounded-lg shadow-lg">
            <div className="relative">
              <img
                src={guide.img}
                alt={guide.topic}
                className="w-full h-full object-cover  transition-opacity duration-500 group-hover:opacity-0"
              />
              <img
                src={guide.hoverImg}
                alt={`${guide.topic} Hover`}
                className="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </div>
            
            <div className="box-text p-4 bg-white ">
           
              <p className="font-bold text-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 group-hover:animate-fade-in transition-all duration-500">{guide.name}</p>
              
              
              <p className="text-sm mt-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 group-hover:animate-fade-in transition-all duration-500">
                <span className="font-semibold">{guide.description}</span> 
              </p>
              <p className="text-lg mb-12 font-bold text-gray-800 opacity-100 group-hover:opacity-0 transition-opacity duration-500 absolute inset-0 flex place-items-end justify-center">
              {guide.maintopic}
</p>
            </div>
            
            <div className="overlay absolute inset-0 bg-zinc-300 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
          </div>
        ))}
      </div>
    </div>
    </section>
    <div className="my-8"></div>
    <div className="p-8 bg-slate-100 min-h-screen">
   
        {/* FAQs */}
        <div className="text-left">
          <FAQ />
        </div>
        
        <div className="my-8"></div>
         {/* Contact Us */}
    <section className="bg-white shadow-md rounded-lg p-6 text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 ">Contact Us</h1>
          <p className="text-gray-700 mb-4">
            If you have any questions or need further assistance, please feel free to contact us.
          </p>
          <Link 
            to="/contact-us" 
            className="inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 hover:scale-110 transition duration-300"
          >
            Contact Us
          </Link>
        </section>
        </div>
    </div>
  );
};

export default UserGuide;
