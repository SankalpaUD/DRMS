import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/user.model.js';

dotenv.config(); // Load environment variables

const seedAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const admins = [
            { name: 'Super Admin', password: 'Sadmin', email: 'superadmin@example.com', role: 'Super Admin' },
            { name: 'Resource Admin', password: 'Radmin', email: 'resourceadmin@example.com', role: 'Resource Admin' },
            { name: 'Acceptance Admin', password: 'Aadmin', email: 'acceptanceadmin@example.com', role: 'Acceptance Admin' }
        ];

        for (const admin of admins) {
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            const newAdmin = new User({
                name: admin.name,
                email: admin.email,
                password: hashedPassword,
                role: admin.role,
                avatar: 'https://cdn.vectorstock.com/i/500p/94/35/admin-icon-isolated-on-white-background-vector-53099435.jpg' // Default admin avatar
            });
            await newAdmin.save();
            console.log(`Admin ${admin.name} created`);
        }

        console.log('Admin seeding completed');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding admins:', error);
        mongoose.disconnect();
    }
};

seedAdmins();