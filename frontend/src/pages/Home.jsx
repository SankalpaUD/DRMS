import React from 'react';

export default function Home() {
  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-center justify-center">
      <header className="bg-indigo-400 py-4 shadow-md mt-5">
        <h1 className="text-white text-3xl font-bold text-center">Welcome to ResourceFlow</h1>
      </header>
      <main className="flex flex-col items-center mt-8">
        <section className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">About Us</h2>
          <p className="text-gray-700 mb-4">
            ResourceFlow is a comprehensive resource management system designed to streamline the process of booking and managing resources within a department.
          </p>
          <p className="text-gray-700">
            Our platform allows students, staff, and guests to easily request and manage resources, ensuring efficient and effective resource utilization.
          </p>
        </section>
        <section className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Easy resource booking</li>
            <li>Real-time availability tracking</li>
            <li>Automated approval workflows</li>
            <li>Comprehensive reporting and analytics</li>
          </ul>
        </section>
      </main>
      <footer className="bg-blue-600 w-full py-4 mt-auto shadow-md">
        <p className="text-white text-center">&copy; 2023 ResourceFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
