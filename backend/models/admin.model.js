import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    avatar: {
        type: String,
        default: 'https://cdn.vectorstock.com/i/500p/94/35/admin-icon-isolated-on-white-background-vector-53099435.jpg'
    },
    role: {
        type: String,
        enum: ['Super Admin', 'Resource Admin', 'Acceptance Admin'],
        required: true
    }
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;