import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaCogs, FaCalendarAlt } from 'react-icons/fa';
import img from '../assets/img.png';
import WebComponents from '../components/WebComponents';
import lms from '../assets/lms.jpeg';
import fosmis from '../assets/fosmis.jpeg';
import department from '../assets/department.jpeg';
import university from '../assets/university.jpeg';
import report from '../assets/report.jpg';
import booking from '../assets/booking.jpg';
import analysis from '../assets/analysis.png';

export default function Home() {
  const { currentUser } = useSelector(state => state.user);

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-100">
      <main className="flex flex-col items-center w-full">
        <div className="h-auto flex-col justify-start items-start inline-flex overflow-hidden w-full">
          <div className="h-auto px-16 py-20 flex-col justify-start items-start gap-20 flex overflow-hidden w-full">
            <div className="self-stretch justify-start items-center gap-12 inline-flex">
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-8 inline-flex">
                <div className="self-stretch h-auto flex-col justify-start items-start gap-6 flex">
                  <div className="self-stretch text-black text-4xl font-bold leading-tight">Streamline Your Resource Management with Our ResourceFlow</div>
                  <div className="self-stretch text-black text-lg font-normal leading-relaxed">Our resource management system simplifies the way departments handle bookings and resources. With intuitive tools for managing requests and tracking availability, efficiency is just a click away.</div>
                </div>
                <div className="self-stretch h-auto flex-col justify-start items-start gap-4 flex">
                  <div className="self-stretch py-2 justify-start items-start gap-6 inline-flex">
                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
                      <div className="w-12 h-12 relative overflow-hidden flex items-center justify-center bg-indigo-500 text-white rounded-full">
                        <FaCogs size={24} />
                      </div>
                      <Link to="/resources" className="self-stretch text-black text-xl font-bold leading-7 hover:underline">Check Resources</Link>
                      <div className="self-stretch text-black text-base font-normal leading-normal">Easily add, update, and track resources to meet your department's needs.</div>
                    </div>
                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
                      <div className="w-12 h-12 relative overflow-hidden flex items-center justify-center bg-indigo-500 text-white rounded-full">
                        <FaCalendarAlt size={24} />
                      </div>
                      <Link to="/bookings" className="self-stretch text-black text-xl font-bold leading-7 hover:underline">Check Bookings</Link>
                      <div className="self-stretch text-black text-base font-normal leading-normal">Manage bookings effortlessly with approval workflows and real-time availability updates.</div>
                    </div>
                  </div>
                </div>
              </div>
              <img className="grow shrink basis-0 h-96 w-96 rounded-3xl shadow-lg" src={img} alt="Resource Management" />
            </div>
          </div>
          <div className="h-auto px-16 py-10 flex-col justify-start items-center gap-20 flex overflow-hidden w-full">
            <div className="h-auto flex-col justify-start items-center gap-4 flex">
              <div className="justify-start items-center inline-flex">
                <div className="text-center text-black text-base font-semibold leading-normal">Streamlined</div>
              </div>
              <div className="self-stretch h-auto flex-col justify-start items-center gap-6 flex">
                <div className="self-stretch text-center text-black text-5xl font-bold leading-tight">Effortless Resource Management for Everyone</div>
                <div className="self-stretch text-center text-black text-lg font-normal leading-relaxed">Our system simplifies resource management for students, academic staff, and administrators alike. Experience seamless booking and reporting tools designed to enhance your productivity.</div>
              </div>
            </div>
            <div className="self-stretch h-auto flex-col justify-start items-start gap-16 flex">
              <div className="w-full justify-center items-start gap-24 inline-flex">
                <div className="grow shrink basis-0 flex-col justify-start items-start gap-8 inline-flex overflow-hidden">
                  <img className="self-stretch h-60 rounded-3xl shadow-lg" src={analysis}alt="Comprehensive Resource Management" />
                  <div className="self-stretch h-auto flex-col justify-start items-center gap-6 flex">
                    <div className="self-stretch text-center text-black text-2xl font-bold leading-tight">Comprehensive Resource Management Solutions</div>
                    <div className="self-stretch text-center text-black text-base font-normal leading-normal">Manage all your departmental resources in one place.</div>
                  </div>
                </div>
                <div className="grow shrink basis-0 flex-col justify-start items-start gap-8 inline-flex overflow-hidden">
                  <img className="self-stretch h-60 rounded-3xl shadow-lg" src={booking} alt="Efficient Booking Management" />
                  <div className="self-stretch h-auto flex-col justify-start items-center gap-6 flex">
                    <div className="self-stretch text-center text-black text-2xl font-bold leading-tight">Efficient Booking Management Features</div>
                    <div className="self-stretch text-center text-black text-base font-normal leading-normal">Streamline your booking process with our intuitive interface.</div>
                  </div>
                </div>
                <div className="grow shrink basis-0 flex-col justify-start items-start gap-8 inline-flex overflow-hidden">
                  <img className="self-stretch h-60 rounded-3xl shadow-lg" src={report} alt="Advanced Reporting Tools" />
                  <div className="self-stretch h-auto flex-col justify-start items-center gap-6 flex">
                    <div className="self-stretch text-center text-black text-2xl font-bold leading-tight">Advanced Reporting Tools for Insights</div>
                    <div className="self-stretch text-center text-black text-base font-normal leading-normal">Generate insightful reports to track resource usage and efficiency.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="justify-start items-center gap-6 inline-flex">
              <div className="px-6 py-3 border border-black justify-center items-center gap-2 flex overflow-hidden rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
                <Link to="/user-guide" className="text-black text-base font-normal leading-normal">Learn More</Link>
              </div>
              {!currentUser && (
              <div className="px-9 py-3 border border-indigo-500 justify-center items-center gap-2 flex overflow-hidden rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
                <Link to="/signup" className="text-black text-base font-normal leading-normal">Sign Up</Link>
              </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 h-80 w-screen">
            <WebComponents
              image={lms}
              title="LMS"
              link="http://scilms.ruh.ac.lk/science/"
            />
            <WebComponents
              image={fosmis}
              title="FOSMIS"
              link="https://paravi.ruh.ac.lk/fosmis/"
            />
            <WebComponents
              image={department}
              title="CS Department"
              link="https://www.sci.ruh.ac.lk/computer/"
            />
            <WebComponents
              image={university}
              title="Ruhuna University"
              link="https://www.ruhuna.ac.lk"
            />
          </div>

      </div>
      </main>
    </div>
  );
}