require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const admin = new User({
      name: 'Admin',
      email: 'admin@updategifts.com',
      password: hashedPassword,
      isAdmin: true
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create admin:');
    console.error(err);
    process.exit(1);
  }
}
createAdmin();
