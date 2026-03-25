require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const HomeSection = require('./models/HomeSection');
const Category = require('./models/Category');
const bcrypt = require('bcryptjs');

const products = [
  { 
    name: 'Ayyappan 18-Step MDF Step With Photo Cutout', 
    price: 999, 
    image: 'https://updategifts.in/wp-content/uploads/2025/11/iyya-3-900x900.jpg', 
    category: 'MDF Gifts', 
    description: 'Beautiful Ayyappan 18-step MDF display with free photo cutout.',
    customFields: [{ type: 'image', label: 'Upload Photo', required: true, maxPhotos: 1 }]
  },
  { 
    name: 'Romantic Combo Gift – Sweet Memories & Love Tokens', 
    price: 499, 
    originalPrice: 599, 
    image: 'https://updategifts.in/wp-content/uploads/2026/01/499-01-900x900.jpg', 
    category: 'Valentine Combos', 
    badge: 'Sale', 
    description: 'The perfect romantic combo gift.',
    customFields: [{ type: 'image', label: 'Upload Couple Photo', required: true, maxPhotos: 1 }]
  },
  { name: "Special Love Combo – Valentine's Week Combo", price: 1499, originalPrice: 1800, image: 'https://updategifts.in/wp-content/uploads/2026/01/1499-02-900x900.jpg', category: 'Valentine Combos', badge: 'Sale', description: "Complete Valentine's week combo." },
];

const categories = [
  { name: 'MDF Gifts', image: 'https://updategifts.in/wp-content/uploads/2025/11/iyya-3-900x900.jpg', order: 1 },
  { name: 'Photo Frames', image: 'https://updategifts.in/wp-content/uploads/2026/02/murugan-01-900x900.jpg', order: 2 },
  { name: 'Home Decors', image: 'https://updategifts.in/wp-content/uploads/2025/11/02-36-900x900.jpg', order: 3 },
  { name: 'Valentine Combos', image: 'https://updategifts.in/wp-content/uploads/2026/01/499-01-900x900.jpg', order: 4 },
];

const homeSections = [
  { title: 'Trending Now', subtitle: 'Our most popular personalized gifts', type: 'badge', value: 'Sale', order: 1 },
  { title: "Valentine's Specials", subtitle: 'Express your love with personalized combos', type: 'category', value: 'Valentine Combos', order: 2 },
  { title: 'Budget Friendly', subtitle: 'Amazing gifts under ₹500', type: 'price', value: '500', order: 3 },
  { title: 'Other Items', subtitle: 'Explore our collection', type: 'custom', value: 'all', order: 4 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Products seeded!');

    await HomeSection.deleteMany({});
    await HomeSection.insertMany(homeSections);
    console.log('Home sections seeded!');

    await Category.deleteMany({});
    await Category.insertMany(categories);
    console.log('Categories seeded!');

    const existingAdmin = await User.findOne({ email: 'admin@updategifts.com' });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({ name: 'Admin', email: 'admin@updategifts.com', password: hashedPassword, isAdmin: true });
      console.log('Admin user created!');
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
