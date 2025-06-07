"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const Product_1 = __importDefault(require("../models/Product"));
const products_1 = __importDefault(require("./products"));
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(config_1.default.mongoUri);
        console.log('Connected to MongoDB');
        // Clear existing products
        await Product_1.default.deleteMany({});
        console.log('Products cleared');
        // Insert sample products
        await Product_1.default.insertMany(products_1.default);
        console.log('Sample products inserted');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
seedDatabase();
