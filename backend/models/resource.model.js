import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: [String],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  availability: {
    type: Boolean,
    default: true,
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

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;