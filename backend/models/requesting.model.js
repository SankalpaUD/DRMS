import mongoose from 'mongoose';

const resourceRequestSchema = new mongoose.Schema({
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
  requestDate: {
    type: Date,
    required: true,
  },
  takenTime: {
    type: String,
    required: true,
  },
  handoverTime: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Request = mongoose.model('resourceRequest', resourceRequestSchema);

export default Request;