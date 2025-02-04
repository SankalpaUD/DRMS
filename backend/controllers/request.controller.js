import { Resource } from '../models/resource.model.js';
import Request from '../models/requesting.model.js';

export const createRequest = async (req, res, next) => {
  const { resource, requestDate, takenTime, handoverTime, reason, additionalDetails, userRole, userDetails } = req.body;
  const userId = req.user._id; // Get the user ID from the authenticated user

  try {
    const resourceData = await Resource.findById(resource);
    if (!resourceData) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check for timetable conflicts
    const dayOfWeek = new Date(requestDate).toLocaleString('en-us', { weekday: 'long' });
    const conflict = resourceData.timetable.some(t => 
      t.day === dayOfWeek && 
      t.isAvailable === false && 
      ((takenTime >= t.startTime && takenTime < t.endTime) || 
       (handoverTime > t.startTime && handoverTime <= t.endTime))
    );

    if (conflict) {
      return res.status(400).json({ message: 'Resource is not available during the requested time' });
    }

    const newRequest = new Request({
      resource: resourceData._id,
      user: userId,
      requestDate,
      takenTime,
      handoverTime,
      reason,
      additionalDetails,
      userRole,
      userDetails: userRole === 'user' ? userDetails : undefined,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    next(error);
  }
};

export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate('resource user');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
};

export const getRequestById = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await Request.findById(id).populate('resource user');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching request', error });
  }
};

export const approveRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await Request.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error approving request', error });
  }
};

export const rejectRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await Request.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting request', error });
  }
};

export const deleteRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await Request.findByIdAndDelete(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting request', error });
  }
};

export const getUserBookings = async (req, res) => {
  const userId = req.user._id;

  try {
    const requests = await Request.find({ user: userId }).populate('resource');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user bookings', error });
  }
};

export const getUserBookingById = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Request.findById(bookingId).populate('resource').populate('user');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking details', error });
  }
};