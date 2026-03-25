require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected');
    const users = await User.find({});
    console.log('Current users:', users.map(u => u.email));
    
    const email = 'admin@updategifts.com';
    const deleted = await User.deleteOne({ email });
    console.log('Deleted admin count:', deleted.deletedCount);
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
test();
