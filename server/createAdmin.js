const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crochet-website');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin account already exists');
      process.exit(0);
    }

    // Create admin account
    const admin = new Admin({
      username: 'admin',
      password: 'admin123', // You can change this
      email: 'admin@crochetwebsite.com'
    });

    await admin.save();
    console.log('Admin account created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();