import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../models/admin.model.js';

dotenv.config(); // Load environment variables

const seedAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const admins = [
            { username: 'superadmin', password: 'Sadmin', email: 'superadmin@example.com', role: 'Super Admin' },
            { username: 'resourceadmin', password: 'Radmin', email: 'resourceadmin@example.com', role: 'Resource Admin' },
            { username: 'acceptanceadmin', password: 'Aadmin', email: 'acceptanceadmin@example.com', role: 'Acceptance Admin' }
        ];

        for (const admin of admins) {
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            const newAdmin = new Admin({
                ...admin,
                password: hashedPassword
            });
            await newAdmin.save();
            console.log(`Admin ${admin.username} added`);
        }

        mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding admin users:', error);
        mongoose.disconnect();
        process.exit(1);
    }
};

seedAdmins().then(() => {
    console.log('Admin users seeded successfully');
    process.exit();
}).catch((error) => {
    console.error('Error seeding admin users:', error);
    process.exit(1);
});