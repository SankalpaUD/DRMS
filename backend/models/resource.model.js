import mongoose from 'mongoose';

const options = { discriminatorKey: 'resourceType', collection: 'resources' };

const timetableSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: false, // Default to false for lecture hours
  },
});

const resourceSchema = new mongoose.Schema({
  name: {
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
  resourceType: {
    type: String,
    required: true,
    enum: ['PremisesResourceType', 'AssetResourceType'],
  },
  timetable: {
    type: [timetableSchema], // Add timetable field
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, options);

const Resource = mongoose.model('Resource', resourceSchema);

const premisesResourceSchema = new mongoose.Schema({
  premiType: {
    type: String,
    required: true,
    enum: ['Lecture Room', 'Auditorium', 'Mini Auditorium', 'Computer Lab', 'Discussion Room'],
  },
  capacity: {
    type: Number,
    required: true,
  },
  isAC: {
    type: Boolean,
    default: false,
  },
  hasWhiteboard: {
    type: Boolean,
    default: false,
  },
  hasProjector: {
    type: Boolean,
    default: false,
  },
  // Additional dynamic attributes
  additionalAttributes: {
    type: Map, // Key-value pairs for additional attributes
    of: String,
    default: {},
  },
});

const assetResourceSchema = new mongoose.Schema({
  assetType: {
    type: String,
    required: true,
    enum: ['Laptop', 'Projector', 'Microphone', 'Speaker', 'Camera'],
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const PremisesResourceType = Resource.discriminator('PremisesResourceType', premisesResourceSchema);
const AssetResourceType = Resource.discriminator('AssetResourceType', assetResourceSchema);

export { Resource, PremisesResourceType, AssetResourceType };



