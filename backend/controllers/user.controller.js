import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import UpgradeRequest from '../models/upgradeReq.model.js';
import cloudinary from '../utils/cloudinary.js';
import { errorHandler } from '../utils/error.js';
import Notification from '../models/notification.model.js'; // Import Notification model

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(errorHandler(500, 'Error fetching users'));
  }
};

// Update a user
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id && req.user.role !== 'Super Admin') {
    return next(errorHandler(401, 'You can only update your own account or you must be a Super Admin'));
  }
  try {
    let avatarUrl;
    if (req.file) {
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'avatars',
              overwrite: true,
            },
            (error, result) => {
              if (result) {
                resolve(result.secure_url);
              } else {
                reject(error);
              }
            }
          );
          stream.end(req.file.buffer);
        });
      };
      avatarUrl = await streamUpload(req);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        avatar: avatarUrl || req.body.avatar,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    next(errorHandler(500, 'Error updating user'));
  }
};

// Delete a user
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id && req.user.role !== 'Super Admin') {
    return next(errorHandler(401, 'You can only delete your own account or you must be a Super Admin'));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(errorHandler(500, 'Error deleting user'));
  }
};

export const createUpgradeRequest = async (req, res, next) => {
  const { idNumber, idName, note, requestedRole } = req.body;
  const userId = req.user.id;

  try {
    const idFrontImage = req.files.idFrontImage[0];
    const idBackImage = req.files.idBackImage[0];

    const uploadImage = (file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'upgradeRequests',
            overwrite: true,
          },
          (error, result) => {
            if (result) {
              resolve(result.secure_url);
            } else {
              reject(error);
            }
          }
        );
        stream.end(file.buffer);
      });
    };

    const [idFrontImageUrl, idBackImageUrl] = await Promise.all([
      uploadImage(idFrontImage),
      uploadImage(idBackImage),
    ]);

    const newRequest = new UpgradeRequest({
      userId,
      requestedRole,
      idDetails: {
        idNumber,
        idName,
      },
      idFrontImageUrl,
      idBackImageUrl,
      note,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    next(error);
  }
};

export const approveUpgradeRequest = async (req, res, next) => {
  const { requestId, status, role, idNumber, idName } = req.body;
  try {
    const upgradeRequest = await UpgradeRequest.findById(requestId).populate('userId', 'name email');
    if (!upgradeRequest) {
      return res.status(404).json({ message: 'Upgrade request not found' });
    }

    upgradeRequest.status = status;
    await upgradeRequest.save();

    if (status === 'approved') {
      const updatedUser = await User.findByIdAndUpdate(
        upgradeRequest.userId,
        {
          role: role || upgradeRequest.requestedRole,
          upgradeRequestStatus: 'approved',
          $set: {
            'idDetails.idNumber': idNumber,
            'idDetails.idName': idName,
          },
        },
        { new: true, useFindAndModify: false }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Create a notification for the user
      await Notification.create({
        user: upgradeRequest.userId, // User ID from the upgrade request
        message: `Your upgrade request to the role "${role || upgradeRequest.requestedRole}" has been approved.`,
      });

      res.status(200).json(updatedUser);
    } else {
      await User.findByIdAndUpdate(upgradeRequest.userId, { upgradeRequestStatus: 'rejected' }, { new: true, useFindAndModify: false });

      // Create a notification for the user
      await Notification.create({
        user: upgradeRequest.userId, // User ID from the upgrade request
        message: `Your upgrade request to the role "${upgradeRequest.requestedRole}" has been rejected.`,
      });

      res.status(200).json({ message: `Upgrade request ${status}` });
    }
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

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(errorHandler(400, 'Current password is incorrect'));
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    next(errorHandler(500, 'Error changing password'));
  }
};

export const updateUser2 = async (req, res, next) => {
  try {
    // Ensure the user is updating their own account
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can only update your own account'));
    }

    let avatarUrl;
    if (req.file) {
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'avatars',
              overwrite: true,
            },
            (error, result) => {
              if (result) {
                resolve(result.secure_url);
              } else {
                reject(error);
              }
            }
          );
          stream.end(req.file.buffer);
        });
      };
      avatarUrl = await streamUpload(req);
    }

    // Update the user details
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        avatar: avatarUrl || req.body.avatar,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    next(errorHandler(500, 'Error updating user'));
  }
};

export const deleteUser2 = async (req, res, next) => {
  try {
    // Ensure the user is deleting their own account
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'You can only delete your own account' });
    }

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};