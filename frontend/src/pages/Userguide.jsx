import React from 'react';

export default function Userguide() {
  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-10 mt-20 text-gray-800 text-center">User Guide</h1>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Introduction</h2>
          <p className="text-gray-700">
            Welcome to the ResourceFlow User Guide. This guide will help you understand how to use the platform effectively to manage and book resources.
          </p>
        </section>
        {/* Step-by-Step Instructions */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Step-by-Step Instructions</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Sign up for an account by clicking on the "Sign Up" button on the homepage.</li>
            <li>Log in to your account using your email and password.</li>
            <li>Navigate to the "Resources" page to view available resources.</li>
            <li>Select a resource and click on "Book Now" to make a booking request.</li>
            <li>Check your booking status on the "Bookings" page.</li>
            <li>Manage your profile and settings from the "Profile" page.</li>
          </ol>
        </section>
        {/* FAQs */}
        <section>
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