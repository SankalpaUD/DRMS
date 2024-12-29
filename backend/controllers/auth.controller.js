import User from '../models/user.model.js';
import Admin from '../models/admin.model.js'; // Import Admin model
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || name === '' || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  const hashpassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashpassword
  });

  try {
    await newUser.save();
    res.json({ message: 'Signup successful' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  try {
    // First, try to find the user in the User collection
    let user = await User.findOne({ email });

    // If the user is not found, try to find the admin in the Admin collection
    if (!user) {
      user = await Admin.findOne({ email });
    }

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    const isMatch = bcryptjs.compareSync(password, user.password);

    if (!isMatch) {
      return next(errorHandler(400, 'Wrong credentials!'));
    }

    const token = jwt.sign({ id: user._id, role: user.role || 'User' }, process.env.JWT_SECRET);

    const { password: userPassword, ...userWithoutPassword } = user._doc;

    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const { password: userPassword, ...userWithoutPassword } = user._doc;

      return res
        .status(200)
        .cookie('access_token', token, { httpOnly: true })
        .json(userWithoutPassword);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashpassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        name: name,
        email,
        password: hashpassword,
        avatar: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const { password: userPassword, ...userWithoutPassword } = newUser._doc;
      return res
        .status(200)
        .cookie('access_token', token, { httpOnly: true })
        .json(userWithoutPassword);
    }
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId) || await Admin.findById(userId);

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};