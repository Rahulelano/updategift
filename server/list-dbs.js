require('dotenv').config();
const { MongoClient } = require('mongodb');

async function main() {
  // Remove the database name from the URL to connect to the cluster root
  const url = process.env.MONGODB_URI.replace('/giftHub', '/');
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log('Connected to Cluster root');
    
    const dbs = await client.db().admin().listDatabases();
    console.log('Available Databases:');
    dbs.databases.forEach(db => console.log(` - ${db.name}`));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
main();
