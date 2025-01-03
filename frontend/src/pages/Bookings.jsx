import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from '../components/Modal';

const localizer = momentLocalizer(moment);

const Bookings = () => {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        const response = await axios.get('/api/resource/getRequest');
        const approved = response.data.filter(request => request.status === 'approved');
        setApprovedRequests(approved);
      } catch (error) {
        console.error('Error fetching approved resource requests:', error);
      }
    };

    fetchApprovedRequests();
  }, []);

  const events = approvedRequests.map(request => ({
    title: request.resource?.name || 'N/A',
    start: new Date(request.requestDate),
    end: new Date(request.requestDate),
    allDay: true,
    resource: request,
  }));

  const handleSelectEvent = (event) => {
    setSelectedBooking(event.resource);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Current Bookings</h1>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={handleSelectEvent}
          />
        </div>
        <Modal show={showModal} onClose={handleCloseModal}>
          {selectedBooking && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
              <p className="text-lg"><strong>Resource Name:</strong> {selectedBooking.resource?.name || 'N/A'}</p>
              <p className="text-lg"><strong>User:</strong> {selectedBooking.user?.name || 'N/A'}</p>
              <p className="text-lg"><strong>Request Date:</strong> {new Date(selectedBooking.requestDate).toLocaleDateString()}</p>
              <p className="text-lg"><strong>Taken Time:</strong> {selectedBooking.takenTime}</p>
              <p className="text-lg"><strong>Handover Time:</strong> {selectedBooking.handoverTime}</p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Bookings;