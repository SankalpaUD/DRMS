import React from 'react';
import {FaFacebook, FaGlobe, FaPhoneAlt, FaEnvelope, FaResearchgate } from 'react-icons/fa';

function Footer() {
  return (
    
    <div className="border border-t-8 border-teal-500 rounded py-8 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32  bg-indigo-500 text-white ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
       
      <div className="text-left  ">
          <h3 className="text-lg font-bold mb-2 text-left text-flex">Contact Us</h3>
          <ul className="text-sm space-y-2 flex flex-col " >
          
            <li>
            <div className="flex items-center space-x-2">
            <div className="bg-blue-500 p-3 rounded-full text-white">
              <FaPhoneAlt size={24} />
            </div>
                    <div>
                    
                    <p className="text-white hover:underline"><a href="tel:+9470 3136765 ">+1 123 456 7890</a></p>
                    </div>
            </div>
            </li>

            <li>
          <div className="flex items-center space-x-2">
            <div className="bg-blue-500 p-3 rounded-full text-white">
              <FaEnvelope size={24} />
            </div>
                <div>
                    
                    <p className="text-white hover:underline"><a href="mailto:contact@example.com">contact@example.com</a></p>
                </div>
             </div>
            </li>
            
            
            
          </ul>
        </div>
        
        <div className="text-leftr">
          <h3 className="text-lg font-bold mb-2">Legal</h3>
          <ul className="text-sm">
            
            <li>
              <a
                href="#"
                className="text-primary hover:text-primary-foreground  hover:text-yellow-300"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-primary hover:text-primary-foreground  hover:text-yellow-300"
              >
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        
        <div className="text-left">
          <h3 className="text-lg font-bold mb-2">Helpful Links</h3>
          <ul className="text-sm">
            <li>
              <a
                href="#"
                className="text-primary hover:text-primary-foreground  hover:text-yellow-300"
              >
                LMS
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-primary hover:text-primary-foreground  hover:text-yellow-300"
              >
                FOSMIS
              </a>
            </li>
           
            
          </ul>
        </div>
      </div>
      
      <div className="mt-8 border-t border-border flex justify-center items-center text-sm">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://www.sci.ruh.ac.lk/computer/"
            target="_blank"
            className="hover:underline  hover:text-yellow-300 "
          >
            DCS@UOR 
          </a>
            .All Rights Reserved.
        </p>
      </div>
      
  	 			
  	 			<div className="social-links flex gap-6 sm:mt-4 mt-4 sm:justify-center  ">
  	 				<a href="https://www.ruhuna.ac.lk" target='_blank'><i className="dark:hover:text-white dark:text-gray-400"></i><FaFacebook/></a>
  	 				<a href="https://www.ruhuna.ac.lk" target='_blank'><i  className="fab fa-twitter  hover:text-yellow-300"></i><FaResearchgate/></a>
  	 				<a href="https://www.ruhuna.ac.lk" target='_blank'><i  className="fab fa-instagram  hover:text-yellow-300"></i><FaGlobe/></a>
  	 			
  	 			</div>
  	 		
    </div>
    
  )
}

export default Footer