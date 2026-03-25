require('dotenv').config();
const mongoose = require('mongoose');

// Define schema inline to avoid any issues with external model files
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected');
    
    // Check if collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    const User = mongoose.model('UserTest', userSchema, 'users');
    
    const count = await User.countDocuments({});
    console.log('User count:', count);

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    console.log('Saving user...');
    await User.create({
      name: 'Admin',
      email: 'admin@updategifts.com',
      password: hashedPassword,
      isAdmin: true
    });
    console.log('Success!');
    process.exit(0);
  } catch (err) {
    console.error('FULL ERROR:');
    console.error(JSON.stringify(err, null, 2));
    console.error(err.stack);
    process.exit(1);
  }
}
main();
