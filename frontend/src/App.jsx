import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Navbar from './components/NavBar';
import Profile from './pages/Profile';
import Sidebar from './components/SideBar';
import PrivateRoute from './components/PrivateRoute';
import Editprofile from './pages/Editprofile';
import AddResource from './pages/Addresource';
import EditResource from './pages/EditResource'; 
import AuthProvider from './context/AuthContext';
import Resources from './pages/Resources';
import Resource from './pages/Resource';
import Bookings from './pages/Bookings';
import UpgradeRequestForm from './pages/UpgradeRequestForm';
import AdminUpgradeRequests from './pages/AdminUpgradeRequests';
import UpgradeDetails from './pages/UpgradeDetails';
import Landing from './pages/Landing';
import Footer from './components/Footer';
import ResourceRequestForm from './pages/ResourceRequestForm';
import AdminResourceRequests from './pages/AdminResourceRequests';
import AdminResourceRequestDetails from './pages/AdminResourceRequestDetails';
import ContactUs from './pages/ContactUs';
import ReportIssue from './pages/ReportIssue';
import IssuesList from './pages/IssuesList';
import IssueFeedback from './pages/IssueFeedback';
import Notification from './pages/Notifications';
import UserGuide from './pages/Userguide';
import TimetableManagement from './pages/TimetableManagement';
import AddFulfillStaff from './pages/AddFulfillStaff';
import ShowFulfillStaff from './pages/ShowFulfillStaff';
import EditFulfillStaff from './pages/EditFulfillStaff';
import AddUser from './pages/AddUser';
import ManageUsers from './pages/ManageUsers';
import EditUser from './pages/EditUser';

function MainApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation(); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (location.pathname === '/' && window.innerWidth < 768) {
      setIsSidebarOpen(false);} 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [location.pathname]);

  const isLandingPage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      {!isLandingPage && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
      <div className="flex-1 transition-all duration-300">
        {!isLandingPage && <Navbar toggleSidebar={toggleSidebar} />}
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-56' : 'ml-0'} ${!isLandingPage ? 'pt-16' : ''}`}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/user-guide" element={<UserGuide/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resource/:id" element={<Resource />} />
            <Route path="/request/:resourceId" element={<ResourceRequestForm />} />
            <Route path="/upgrade-request" element={<UpgradeRequestForm />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/report-issue/:resourceId" element={<ReportIssue />} />
            <Route path="/issue-feedback/:id" element={<IssueFeedback />} />
            <Route path="notifications" element={<Notification />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<Editprofile />} />
            </Route>
            <Route element={<PrivateRoute roles={['Super Admin']} />}>
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/manage-users" element={<ManageUsers />} />
              <Route path="/edit-user" element={<EditUser />} />
            </Route>
            <Route element={<PrivateRoute roles={['Super Admin', 'Resource Admin']} />}>
              <Route path="/add-resource" element={<AddResource />} />
              <Route path="/edit-resource/:id" element={<EditResource />} />
              <Route path="/issues" element={<IssuesList />} />
              <Route path="/timetable-management" element={<TimetableManagement />} />
            </Route>
            <Route element={<PrivateRoute roles={['Super Admin', 'Acceptance Admin']} />}>
              <Route path="/admin/upgrade-requests" element={<AdminUpgradeRequests />} />
              <Route path="/admin/upgrade-requests/:requestId" element={<UpgradeDetails />} />
              <Route path="/admin/resource-requests" element={<AdminResourceRequests />} />
              <Route path="/admin/resource-requests/:requestId" element={<AdminResourceRequestDetails />} />
            </Route>
          <Route element={<PrivateRoute roles={['Super Admin','Fulfillment Admin']} />}>
            <Route path="/add-fulfill-staff" element={<AddFulfillStaff/>} />
            <Route path="/show-fulfill-staff" element={<ShowFulfillStaff/>} />
            <Route path="/edit-fulfill-staff" element={<EditFulfillStaff/>} />
          </Route>
          </Routes>
        </div>
      </div>
      {!isLandingPage && <Footer isSidebarOpen={isSidebarOpen} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
}