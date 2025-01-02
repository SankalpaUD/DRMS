import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Userguide from './pages/UserGuide';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Navbar from './components/navbar';
import Profile from './pages/Profile';
import Sidebar from './components/SideBar';
import PrivateRoute from './components/PrivateRoute';
import Editprofile from './pages/EditProfile';
import AddResource from './pages/AddResource'; 
import AuthProvider from './context/AuthContext';
import Resources from './pages/Resources';
import UpgradeRequestForm from './pages/UpgradeRequestForm';
import AdminUpgradeRequests from './pages/AdminUpgradeRequests';
import UpgradeDetails from './pages/UpgradeDetails';
import Landing from './pages/Landing';
import Footer from './components/Footer';
import ContactUs from './pages/ContactUs';


function MainApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation(); // Get current location

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Check if the current path is Landing
  const isLandingPage = location.pathname === '/';

  return (
    <div className="flex">
      {!isLandingPage && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
      <div className="flex-1 transition-all duration-300">
        {!isLandingPage && <Navbar toggleSidebar={toggleSidebar} />}
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-56' : 'ml-0'} ${!isLandingPage ? 'pt-16' : ''}`}>
          <Routes>
            {/* Public Route: Landing Page */}
            <Route path="/" element={<Landing />} />

            {/* Other Public Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/ContactUs" element={<ContactUs />} />
            <Route path="/user-guide" element={<Userguide />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/upgrade-request" element={<UpgradeRequestForm />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute roles={['user', 'student', 'staff']} />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<Editprofile />} />
            </Route>
            <Route element={<PrivateRoute roles={['Super Admin', 'Resource Admin']} />}>
              <Route path="/add-resource" element={<AddResource />} />
            </Route>
            <Route element={<PrivateRoute roles={['Acceptance Admin']} />}>
              <Route path="/admin/upgrade-requests" element={<AdminUpgradeRequests />} />
              <Route path="/admin/upgrade-requests/:requestId" element={<UpgradeDetails />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
        <Footer/>
      </Router>
    </AuthProvider>
  );
}
