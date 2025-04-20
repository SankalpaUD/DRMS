import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import resourceRoute from './routes/resource.route.js';
import cookieParser from 'cookie-parser';
import analysisRoute from './routes/analysis.route.js';
import chatbotRoute from './routes/chatbot.route.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log(err);
});

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/resource', resourceRoute);
app.use('/api/analysis', analysisRoute);
app.use('/api/chatbot', chatbotRoute);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({ 
        success: false,
        statusCode,
        message
    });
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});