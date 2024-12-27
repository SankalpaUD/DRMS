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
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const UpgradeUser = mongoose.model('UpgradeRequest', upgradeRequestSchema);

export default UpgradeUser;