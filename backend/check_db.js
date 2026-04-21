const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to:', process.env.MONGODB_URI);
    console.log('Database name:', mongoose.connection.name);
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    for (let col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`Collection ${col.name} has ${count} documents`);
    }
    
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkDB();
