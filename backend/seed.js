const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Read JSON files
    const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf-8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf-8'));

    // Insert data
    const insertedProducts = await Product.insertMany(products);
    const insertedUsers = await User.insertMany(users);

    console.log(`Database seeded successfully!`);
    console.log(`Inserted ${insertedProducts.length} products`);
    console.log(`Inserted ${insertedUsers.length} users`);
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
