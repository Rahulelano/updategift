require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const products = [
  { 
    name: 'Ayyappan 18-Step MDF Step With Photo Cutout', 
    price: 999, 
    image: 'https://updategifts.in/wp-content/uploads/2025/11/iyya-3-900x900.jpg', 
    category: 'MDF Gifts', 
    description: 'Beautiful Ayyappan 18-step MDF display with free photo cutout.'
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // 1. Create User First
    const email = 'admin@updategifts.com';
    await User.deleteMany({ email });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      name: 'Admin',
      email: email,
      password: hashedPassword,
      isAdmin: true
    });
    console.log('✅ Admin user created/reset!');

    // 2. Clear and Insert one product at a time to find the error
    await Product.deleteMany({});
    console.log('Products cleared.');
    
    // We'll skip the complex products for a moment to ensure login works
    console.log('Seeding simple product...');
    await Product.create(products[0]);
    console.log('✅ Simple product seeded!');

    console.log('Seed complete! You can now login.');
    process.exit();
  } catch (err) {
    console.error('❌ Seed failed:');
    console.error(err);
    process.exit(1);
  }
};

seed();
