import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null); // State to track open FAQ

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle open FAQ
  };

  const faqData = [
    {
      question: 'How do I reset my password?',
      answer:
        'To reset your password, click on the "Forgot Password" link on the login page and follow the instructions.',
    },
    {
      question: 'How do I cancel a booking?',
      answer:
        'To cancel a booking, go to the "Bookings" page, select the booking you want to cancel, and click on "Cancel Booking".',
    },
    {
      question: 'Who can I contact for support?',
      answer:
        'For support, you can contact our support team at contact@resourceflow.com or call (123) 456-7890.',
    },
  ];

  return (
    <section className="bg-white shadow-md rounded-lg p-6 max-w-full ">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center pb-4">Frequently Asked Questions (FAQs)</h2>
      <div className="space-y-8">
        {faqData.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-2">
            {/* Question Section */}
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full text-left text-lg font-medium text-gray-800 hover:text-blue-600 focus:outline-none"
            >
              {faq.question}
              <svg
                className={`w-5 h-5 transition-transform ${
                  openIndex === index ? 'rotate-180' : 'rotate-0'
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            {/* Answer Section */}
            {openIndex === index && (
              <p className="mt-2 text-gray-700 transition-opacity duration-300">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
