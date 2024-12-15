import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import {errorHandler} from '../utils/error.js';
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
        password : hashpassword
     });

    try {
        await newUser.save();
        res.json({ message: 'Signup successful' });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) =>{
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required'));
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const isMatch = bcryptjs.compareSync(password, user.password);

        if (!isMatch) {
            return next(errorHandler(400, 'Invalid password'));
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const { password: userPassword, ...userWithoutPassword } = user._doc;

        res
            .status(200)
            .cookie('token', token, { httpOnly: true })
            .json(userWithoutPassword);
    } catch (error) {
        next(error);
    }
}