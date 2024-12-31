import mongoose from "mongoose";

const upgradeRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requestedRole: {
    type: String,
    enum: ['student', 'staff'],
    required: true,
  },
  idDetails: {
    idNumber: {
      type: String,
      required: true,
      trim: true,
    },
    idName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  idFrontImageUrl: {
    type: String,
    required: true,
  },
  idBackImageUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UpgradeRequest = mongoose.model('UpgradeRequest', upgradeRequestSchema);

export default UpgradeRequest;