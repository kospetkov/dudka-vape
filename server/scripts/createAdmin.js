import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@dudkavape.com' });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            console.log('📧 Email: admin@dudkavape.com');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            email: 'admin@dudkavape.com',
            password: 'admin123456',
            name: 'Admin',
            phone: '+380000000000',
            role: 'admin'
        });

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@dudkavape.com');
        console.log('🔑 Password: admin123456');
        console.log('⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
