import React from "react";
import {FaFacebook, FaPhoneAlt, FaEnvelope, FaLocationArrow ,FaFacebookF ,FaYoutube ,FaInstagramSquare} from 'react-icons/fa';

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-blue-200 shadow-lg rounded-lg p-8 max-w-7xl w-full  flex flex-col md:flex-row">
        
            <div className="md:w-1/2 px-6 py-25">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                We would love to hear from you. Reach out to us using the details
                below.
              </p>
              <div className="space-y-3 py-24 text-justify">
                <div>
                  <h3 className="font-semibold text-gray-800 ">Address:</h3>
                  
                  <ul className="text-sm space-y-2 flex flex-col py-3 " >
                      <li>
                    <div className="flex items-center space-x-2">
                      <div className="bg-black p-3 rounded-full text-white transform transition-transform duration-300 hover:scale-110">
                        <FaLocationArrow size={15} />
                      </div>
                          <div>
                          
                          <p className="text-gray-600">
                          Department of Computer Science ,Faculty of Science, University of Ruhuna, Matara, Sri Lanka.
                         </p>
                          </div>
                       </div>
                      </li>
                      </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 ">Phone:</h3>
                  <ul className="text-sm space-y-2 flex flex-col py-3 " >
                      
                    <li>
                    <div className="flex items-center space-x-2">
                    <div className="bg-black p-3 rounded-full text-white transform transition-transform duration-300 hover:scale-110">
                      <FaPhoneAlt size={15} />
                    </div>
                        <div>
                        
                        <p className="text-gray-600 hover:underline"><a href="tel:+9470 3136765 ">+1 123 456 7890</a></p>
                        </div>
                    </div>
                    </li>
                 </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 ">Email:</h3>
                  <ul className="text-sm space-y-2 flex flex-col py-3 " >
                      
                      
                          <li>
                        <div className="flex items-center space-x-2">
                          <div className="bg-black p-3 rounded-full text-white transform transition-transform duration-300 hover:scale-110">
                            <FaEnvelope size={15} />
                          </div>
                              <div>
                              
                              <p className="text-gray-600 hover:underline"><a href="mailto:contact@example.com">contact@resourceflow.com</a></p>
                              </div>
                           </div>
                          </li>
                   </ul>
                </div>
                
              </div>
              
            <div>
               
            <h3 className="text-3xl font-bold text-gray-800 mb-4 text-center">Follow Us</h3>
            <ul className="text-sm space-y-2 flex flex-col py-3 " >
                
                <li>
                <div className="flex items-center space-x-2">
                <div className="bg-blue-500 p-3 rounded-full text-white transform transition-transform duration-300 hover:scale-110">
                  <FaFacebookF size={15} />
                </div>
                    <div>
                        
                        <p className="text-gray-600 hover:underline"><a href="https://www.facebook.com/">Facebook</a></p>
                    </div>
                </div>
                </li>
                <li>
                <div className="flex items-center space-x-2">
                <div className="bg-red-500 p-3 rounded-full text-white transform transition-transform duration-300 hover:scale-110">
                  <FaYoutube size={15} />
                </div>
                    <div>
                        
                        <p className="text-gray-600 hover:underline"><a href="https://www.youtube.com/">Youtube</a></p>
                    </div>
                </div>
                </li>
                <li>
                <div className="flex items-center space-x-2">
                <div className="bg-pink-500 p-3 rounded-full text-white transform transition-transform duration-300 hover:scale-110">
                  <FaInstagramSquare size={15} />
                </div>
                    <div>
                        
                        <p className="text-gray-600 hover:underline"><a href="https://www.instagram.com/">Instagram</a></p>
                    </div>
                </div>
                </li></ul>
            </div>
            </div>

            {/* Vertical Line */}
    <div className="hidden md:block w-px bg-gray-400 mx-6 "></div>
        {/* Right Side: Google Map */}
        <div className="md:w-1/2 px-6 py-48">
          <h3 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Our Location
          </h3>
          <div className="w-full h-96">
            <iframe
              title="Google Map"
              className="w-full h-full rounded-lg"
              src="https://www.google.com/maps?q=5.9381,80.5769&z=15&output=embed"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
