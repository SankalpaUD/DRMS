import React from 'react';
import { Link } from 'react-router-dom';

export default function UserGuide() {
  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-800 text-center">User Guide</h1>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Introduction */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Introduction</h2>
          <p className="text-gray-700">
            Welcome to the ResourceFlow User Guide. This guide will help you understand how to use the platform effectively to manage and book resources.
          </p>
        </section>
        {/* Step-by-Step Instructions */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Step-by-Step Instructions</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Sign up for an account by clicking on the "Sign Up" button on the homepage.</li>
            <li>Log in to your account using your email and password.</li>
            <li>Navigate to the "Resources" page to view available resources.</li>
            <li>Select a resource and click on "Request Now" to book it.</li>
            <li>Fill in the required details and submit your request.</li>
            <li>Check the status of your requests on the "My Requests" page.</li>
          </ol>
        </section>
        {/* Contact Us */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions or need further assistance, please feel free to contact us.
          </p>
          <Link 
            to="/contact-us" 
            className="inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Contact Us
          </Link>
        </section>
        {/* FAQs */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Frequently Asked Questions (FAQs)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">How do I reset my password?</h3>
              <p className="text-gray-700">
                To reset your password, click on the "Forgot Password" link on the login page and follow the instructions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">How do I cancel a booking?</h3>
              <p className="text-gray-700">
                To cancel a booking, go to the "Bookings" page, select the booking you want to cancel, and click on "Cancel Booking".
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Who can I contact for support?</h3>
              <p className="text-gray-700">
                For support, you can contact our support team at support@resourceflow.com or call (123) 456-7890.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}