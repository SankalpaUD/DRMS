import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import UpgradeRequest from '../models/upgradeReq.model.js';
import cloudinary from '../utils/cloudinary.js';
import { errorHandler } from '../utils/error.js';

export const test = (req, res) => {
  res.status(200).json({ message: 'Test controller working' });
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
      req.body.avatar = avatarUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const createUpgradeRequest = async (req, res, next) => {
  const { idNumber, idName, note, requestedRole } = req.body;
  const userId = req.user._id;

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
