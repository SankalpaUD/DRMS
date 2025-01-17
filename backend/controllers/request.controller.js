import Request from '../models/requesting.model.js';
import { Resource } from '../models/resource.model.js';

export const createRequest = async (req, res, next) => {
  const { resourceId, requestDate, takenTime, handoverTime } = req.body;
  const userId = req.user._id; // Get the user ID from the authenticated user

  try {
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check for timetable conflicts
    const dayOfWeek = new Date(requestDate).toLocaleString('en-us', { weekday: 'long' });
    const conflict = resource.timetable.some(t => 
      t.day === dayOfWeek && 
      t.isAvailable === false && 
      ((takenTime >= t.startTime && takenTime < t.endTime) || 
       (handoverTime > t.startTime && handoverTime <= t.endTime))
    );

    if (conflict) {
      return res.status(400).json({ message: 'Resource is not available during the requested time' });
    }

    const newRequest = new Request({
      resource: resourceId,
      user: userId, // Include the user ID
      requestDate,
      takenTime,
      handoverTime,
      status: 'Pending',
    });

    await newRequest.save();
    res.status(201).json({ message: 'Request created successfully', request: newRequest });
  } catch (error) {
    next(error);
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate('resource user');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;

    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({ message: 'Request updated successfully', request: updatedRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error updating request', error });
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