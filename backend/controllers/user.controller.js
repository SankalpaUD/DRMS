import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import cloudinary from '../utils/cloudinary.js';
import { errorHandler } from '../utils/error.js';

export const test = (req, res) => {
    res
    .status(200)
    .json({ message: 'Test controller working' });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account"));
  }
  try {
    if (req.body.newPassword) {
      req.body.password = await bcrypt.hash(req.body.newPassword, 10);
    }

    let avatarUrl;
    if (req.file) {
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'avatars',
              public_id: `${req.user.id}_avatar`,
              overwrite: true,
            },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          stream.end(req.file.buffer);
        });
      };

      const result = await streamUpload(req);
      avatarUrl = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar: avatarUrl || req.body.avatar,
          phone: req.body.phone,
          address: req.body.address,
          description: req.body.description,
          idDetails: req.body.idDetails,
        },
      },
      { new: true }
    );
    const { password, ...others } = updatedUser._doc;
    res.status(200).json(others);
  } catch (error) {
    next(error);
  }
};

export const upgradeRequest = async (req, res, next) => {
    const { userId, requestedRole, idNumber, idName } = req.body;
        try {
            const upgradeRequest = new UpgradeRequest({
            userId,
            requestedRole,
            idDetails: { idNumber, idName },
            });
            await upgradeRequest.save();
            await User.findByIdAndUpdate(userId, { upgradeRequestStatus: 'pending' });
            res.status(201).json({ message: 'Upgrade request submitted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error submitting upgrade request', error });
        }
    };

export const approveUpgradeRequest = async (req, res, next) => {
    const { requestId, status } = req.body;
    try {
      const upgradeRequest = await UpgradeRequest.findById(requestId);
      if (!upgradeRequest) {
        return res.status(404).json({ message: 'Upgrade request not found' });
      }
      upgradeRequest.status = status;
      await upgradeRequest.save();
      if (status === 'approved') {
        await User.findByIdAndUpdate(upgradeRequest.userId, {
          role: upgradeRequest.requestedRole,
          upgradeRequestStatus: 'approved',
        });
      } else {
        await User.findByIdAndUpdate(upgradeRequest.userId, { upgradeRequestStatus: 'rejected' });
      }
      res.status(200).json({ message: `Upgrade request ${status}` });
    } catch (error) {
      res.status(500).json({ message: 'Error updating upgrade request', error });
    }
};
