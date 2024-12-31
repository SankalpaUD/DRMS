import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { errorHandler } from './error.js';

export const verify = (roles = []) => {
  return async (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, 'Unauthorized'));

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return next(errorHandler(403, 'Forbidden'));

      try {
        const user = await User.findById(decoded.id);
        if (!user) return next(errorHandler(404, 'User not found'));

        req.user = user;

        if (roles.length && !roles.includes(user.role)) {
          return next(errorHandler(403, 'Access denied'));
        }

        next();
      } catch (error) {
        next(error);
      }
    });
  };
};