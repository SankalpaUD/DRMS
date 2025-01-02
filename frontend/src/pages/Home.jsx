import React from 'react';
//import { handleContactUsClick ,ContactUs} from './ContactUs';
import { Link } from 'react-router-dom';

export default function Home() {
  

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col items-center">
      <header className="bg-indigo-400 py-4 shadow-lg mt-10 transform hover:scale-105 transition-transform duration-300 rounded-lg">
        <h1 className="text-white text-3xl font-bold text-center">Welcome to ResourceFlow</h1>
      </header>
      <main className="flex flex-col items-center mt-8">
        <section className="bg-white p-8 rounded-3xl shadow-2xl w-11/12 md:w-3/4 lg:w-1/2 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4">Userguide Us</h2>
          <p className="text-gray-700 mb-4">
            ResourceFlow is a comprehensive resource management system designed to streamline the process of booking and managing resources within a department.
          </p>
          <p className="text-gray-700">
            Our platform allows students, staff, and guests to easily request and manage resources, ensuring efficient and effective resource utilization.
          </p>
        </section>
        <section className="bg-white p-8 rounded-3xl shadow-2xl w-11/12 md:w-3/4 lg:w-1/2 mt-8 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Easy resource booking</li>
            <li>Real-time availability tracking</li>
            <li>Automated approval workflows</li>
            <li>Comprehensive reporting and analytics</li>
          </ul>
        </section>
        <section className="bg-white p-8 rounded-3xl shadow-2xl w-11/12 md:w-3/4 lg:w-1/2 mt-8 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-700 mb-4">
            ResourceFlow simplifies the resource management process with a few easy steps:
          </p>
          <ol className="list-decimal list-inside text-gray-700">
            <li>Sign up and create an account.</li>
            <li>Browse available resources and make a booking request.</li>
            <li>Receive approval notifications and manage your bookings.</li>
            <li>Access comprehensive reports and analytics for better resource planning.</li>
          </ol>
        </section>
        <section className="bg-white p-8 rounded-3xl shadow-2xl w-11/12 md:w-3/4 lg:w-1/2 mt-8 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4">Testimonials</h2>
          <p className="text-gray-700 mb-4">
            Hear what our users have to say Userguide ResourceFlow:
          </p>
          <blockquote className="text-gray-700 italic mb-4">
            "ResourceFlow has revolutionized the way we manage our department's resources. It's user-friendly and efficient!" - Jane Doe, Department Head
          </blockquote>
          <blockquote className="text-gray-700 italic">
            "The real-time availability tracking feature is a game-changer. It has saved us so much time and effort." - John Smith, Staff Member
          </blockquote>
        </section>
        <section  className="bg-white p-8 rounded-3xl shadow-2xl w-11/12 md:w-3/4 lg:w-1/2 mt-8 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4 hover:underline  hover:text-yellow-300 ">
            <Link to ="/ContactUs">
            Have questions or need assistance? Get in touch with us:
            </Link>
          </p>
         
        </section>
      </main>
    </div>
  );
}