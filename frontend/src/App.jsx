import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Userguide from './pages/Userguide';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import Editprofile from './pages/Editprofile';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 transition-all duration-300">
          <Navbar toggleSidebar={toggleSidebar} />
          <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-56' : 'ml-0'}`}>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/user-guide" element={<Userguide />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/edit-profile" element={<Editprofile />} />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}