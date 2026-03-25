require('dotenv').config();
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    console.log('Connected via Native Driver');
    const db = client.db(); // uses the db from connection string: giftHub
    
    console.log('Creating collection "users"...');
    try {
      await db.createCollection('users');
      console.log('Collection "users" created.');
    } catch (e) {
      console.log('Create collection failed (might exist):', e.message);
    }

    const collection = db.collection('users');
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    console.log('Inserting admin...');
    const result = await collection.insertOne({
      name: 'Admin',
      email: 'admin@updategifts.com',
      password: hashedPassword,
      isAdmin: true,
      createdAt: new Date()
    });
    console.log('Insert result:', result);
    
    process.exit(0);
  } catch (err) {
    console.error('NATIVE ERROR:');
    console.error(err);
    process.exit(1);
  }
}
main();
