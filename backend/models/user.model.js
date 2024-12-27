import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF5-3YjBcXTqKUlOAeUUtuOLKgQSma2wGG1g&s",
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'student', 'staff'],
    default: 'user',
  },
  upgradeRequestStatus: {
    type: String,
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none',
  },
  idDetails: {
    idNumber: {
      type: String,
      trim: true,
    },
    idName: {
      type: String,
      trim: true,
    },
  },
  
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
