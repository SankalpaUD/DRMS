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
  reason: {
    type: String,
    required: true,
  },
  additionalDetails: {
    type: String,
  },
  userRole: {
    type: String,
    enum: ['student', 'staff', 'user'],
    required: true,
  },
  userDetails: {
    type: String,
    required: function() {
      return this.userRole === 'user';
    },
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

resourceRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ResourceRequest = mongoose.model('ResourceRequest', resourceRequestSchema);

export default ResourceRequest;