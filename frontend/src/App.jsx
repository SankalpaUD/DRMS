import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Userguide from './pages/UserGuide';
import Signup from './pages/SignUp';
import Login from './pages/LogIn';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Sidebar from './components/SideBar';
import PrivateRoute from './components/PrivateRoute';
import Editprofile from './pages/EditProfile';
import AddResource from './pages/AddResource'; 
import { AuthProvider } from './context/AuthContext';
import Resources from './pages/Resources';
import UpgradeRequestForm from './pages/UpgradeRequestForm';
import AdminUpgradeRequests from './pages/AdminUpgradeRequests';
import UpgradeDetails from './pages/UpgradeDetails';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex-1 transition-all duration-300">
            <Navbar toggleSidebar={toggleSidebar} />
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-56' : 'ml-0'} pt-16`}>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/user-guide" element={<Userguide />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/resources" element={<Resources/>} />
                <Route element={<PrivateRoute roles={['user']} />}></Route>
                <Route path="/upgrade-request" element={<UpgradeRequestForm />} />
                <Route element={<PrivateRoute roles={['user', 'student', 'staff']} />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/edit-profile" element={<Editprofile />} />
                </Route>
                <Route element={<PrivateRoute roles={['Super Admin', 'Resource Admin']} />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/edit-profile" element={<Editprofile />} />
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
      </Router>
    </AuthProvider>
  );
}