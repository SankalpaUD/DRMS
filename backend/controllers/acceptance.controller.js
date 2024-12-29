import UpgradeRequest from '../models/upgradeReq.model.js';
import User from '../models/user.model.js';

export const acceptBooking = async (req, res) => {
  // Logic to update a resource
};

export const approveUpgradeRequest = async (req, res, next) => {
  const { requestId, status, role } = req.body;

  try {
    const upgradeRequest = await UpgradeRequest.findById(requestId);
    if (!upgradeRequest) {
      return res.status(404).json({ message: 'Upgrade request not found' });
    }

    upgradeRequest.status = status;
    await upgradeRequest.save();

    if (status === 'approved') {
      await User.findByIdAndUpdate(upgradeRequest.userId, {
        role: role || upgradeRequest.requestedRole,
        upgradeRequestStatus: 'approved',
      });
    } else {
      await User.findByIdAndUpdate(upgradeRequest.userId, { upgradeRequestStatus: 'rejected' });
    }

    res.status(200).json({ message: `Upgrade request ${status}` });
  } catch (error) {
    next(error);
  }
};

export const getAllUpgradeRequests = async (req, res, next) => {
  try {
    const upgradeRequests = await UpgradeRequest.find().populate('userId', 'name email');
    res.status(200).json(upgradeRequests);
  } catch (error) {
    next(error);
  }
};

export const getUpgradeRequestById = async (req, res, next) => {
  const { requestId } = req.params;

  try {
    const upgradeRequest = await UpgradeRequest.findById(requestId).populate('userId', 'name email');
    if (!upgradeRequest) {
      return res.status(404).json({ message: 'Upgrade request not found' });
    }
    res.status(200).json(upgradeRequest);
  } catch (error) {
    next(error);
  }
};
