import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const adminEmail = 'admin@dudkavape.com';
        const adminPassword = 'admin123456';

        // Check if admin exists
        let admin = await User.findOne({ email: adminEmail });
        
        if (admin) {
            console.log('📧 Admin exists:', admin.email);
            console.log('👤 Role:', admin.role);
            
            // Update to admin role if not already
            if (admin.role !== 'admin') {
                admin.role = 'admin';
                await admin.save();
                console.log('✅ Updated role to admin');
            }
            
            // Reset password
            admin.password = adminPassword;
            await admin.save();
            console.log('✅ Password reset to:', adminPassword);
        } else {
            // Create new admin
            admin = await User.create({
                email: adminEmail,
                password: adminPassword,
                name: 'Admin DUDKA',
                role: 'admin'
            });
            console.log('✅ Admin created!');
            console.log('📧 Email:', adminEmail);
            console.log('🔑 Password:', adminPassword);
        }

        // List all users
        const users = await User.find().select('email role name');
        console.log('\n📋 All users:');
        users.forEach(u => console.log(`  - ${u.email} (${u.role})`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
