import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Bookings = () => {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [resources, setResources] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [currentView, setCurrentView] = useState(Views.MONTH);

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

  useEffect(() => {
    const fetchResourcesAndTimetables = async () => {
      try {
        const response = await axios.get('/api/resource/get');
        const resources = response.data;
        setResources(resources);

        const allTimetables = [];
        for (const resource of resources) {
          const timetableResponse = await axios.get(`/api/resource/getTimetables/${resource._id}`);
          const resourceTimetables = timetableResponse.data.map(timetable => ({
            ...timetable,
            resourceName: resource.name,
          }));
          allTimetables.push(...resourceTimetables);
        }
        setTimetables(allTimetables);
      } catch (error) {
        console.error('Error fetching resources and timetables:', error);
      }
    };

    fetchResourcesAndTimetables();
  }, []);

  const getDayOfWeekDate = (dayOfWeek, startDate) => {
    const daysOfWeek = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    const date = new Date(startDate);
    const currentDay = date.getDay();
    const distance = daysOfWeek[dayOfWeek] - currentDay;
    date.setDate(date.getDate() + distance);
    return date;
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const filteredBookings = approvedRequests.filter(request => {
    const requestDate = new Date(request.requestDate).toDateString();
    return selectedDate && requestDate === selectedDate.toDateString();
  });

  const lectureBookings = timetables.filter(timetable => {
    const lectureDate = getDayOfWeekDate(timetable.day, selectedDate).toDateString();
    return selectedDate && lectureDate === selectedDate.toDateString();
  });

  const generateRecurringEvents = (timetable) => {
    const events = [];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3); // Generate events for the next 3 months

    for (let date = getDayOfWeekDate(timetable.day, startDate); date <= endDate; date.setDate(date.getDate() + 7)) {
      const eventStart = new Date(date);
      const eventEnd = new Date(date);
      const [startHour, startMinute] = timetable.startTime.split(':');
      const [endHour, endMinute] = timetable.endTime.split(':');

      eventStart.setHours(startHour, startMinute);
      eventEnd.setHours(endHour, endMinute);

      events.push({
        title: `Lecture Hours - ${timetable.resourceName}`,
        start: new Date(eventStart),
        end: new Date(eventEnd),
        allDay: false,
        resource: timetable,
      });
    }

    return events;
  };

  const events = currentView === Views.MONTH ? [] : [
    ...approvedRequests.map(request => ({
      title: request.resource?.name || 'N/A',
      start: new Date(request.requestDate),
      end: new Date(request.requestDate),
      allDay: true,
      resource: request,
    })),
    ...timetables.flatMap(timetable => generateRecurringEvents(timetable))
  ];

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-16 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center uppercase">Current Bookings</h1>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Calendar
            localizer={localizer}
            events={events} // Conditionally show events
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            selectable
            onSelectSlot={handleSelectSlot}
            views={['month', 'week', 'day', 'agenda']} // Show month, week, day, and agenda views
            defaultView={Views.MONTH} // Set the default view to month
            onView={handleViewChange} // Handle view change
            dayPropGetter={(date) => {
              if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
                return { style: { backgroundColor: '#fffbeb', color: 'black' } }; // Highlight selected date with a lighter yellow
              }
              return {};
            }}
          />
        </div>
        {selectedDate && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Bookings for {selectedDate.toDateString()}</h2>
            <p className="text-lg mb-4">Weekday: {selectedDate.toLocaleString('en-us', { weekday: 'long' })}</p>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-300 text-center">Resource Name</th>
                  <th className="py-2 px-4 border-b border-gray-300 text-center">User</th>
                  <th className="py-2 px-4 border-b border-gray-300 text-center">Date</th>
                  <th className="py-2 px-4 border-b border-gray-300 text-center">Time</th>
                  <th className="py-2 px-4 border-b border-gray-300 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking._id}>
                    <td className="py-2 px-4 border-b border-gray-300 text-center">{booking.resource?.name || 'N/A'}</td>
                    <td className="py-2 px-4 border-b border-gray-300 text-center">{booking.user?.name || 'N/A'}</td>
                    <td className="py-2 px-4 border-b border-gray-300 text-center">{new Date(booking.requestDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b border-gray-300 text-center">{`${booking.takenTime} - ${booking.handoverTime}`}</td>
                    <td className="py-2 px-4 border-b border-gray-300 text-center">{booking.status}</td>
                  </tr>
                ))}
                {lectureBookings.map(lecture => (
                  <tr key={lecture._id}>
                    <td className="py-2 px-4 border-b border-gray-300 text-center">{lecture.resourceName}</td>
                    <td className="py-2 px-4 border-b border-gray-300 text-center">Lecture</td>
                    <td className="py-2 px-4 border-b border-gray-300 text-center">{selectedDate.toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b border-gray-300 text-center">{`${lecture.startTime} - ${lecture.endTime}`}</td>
                    <td className="py-2 px-4 border-b border-gray-300 text-center">Scheduled</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;