import mongoose from 'mongoose';
import config from '../config';
import Product from '../models/Product';
import products from './products';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Products cleared');

    // Insert sample products
    await Product.insertMany(products);
    console.log('Sample products inserted');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 