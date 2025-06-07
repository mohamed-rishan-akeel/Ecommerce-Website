"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative'],
    },
    image: {
        type: String,
        required: [true, 'Product image is required'],
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        trim: true,
    },
    brand: {
        type: String,
        required: [true, 'Product brand is required'],
        trim: true,
    },
    countInStock: {
        type: Number,
        required: [true, 'Count in stock is required'],
        min: [0, 'Count in stock cannot be negative'],
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot be more than 5'],
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            name: { type: String, required: true },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                required: true,
                ref: 'User',
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, {
    timestamps: true,
});
// Calculate average rating when a review is added or modified
productSchema.pre('save', function (next) {
    if (this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.rating = totalRating / this.reviews.length;
    }
    next();
});
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
