"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getAllProducts = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
const products_1 = __importDefault(require("../data/products"));
// Get all products
const getAllProducts = async (req, res, next) => {
    try {
        res.status(200).json({
            status: 'success',
            results: products_1.default.length,
            data: {
                products: products_1.default,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllProducts = getAllProducts;
// Get single product
const getProduct = async (req, res, next) => {
    try {
        const product = products_1.default.find(p => p._id === req.params.id);
        if (!product) {
            throw new error_middleware_1.AppError('Product not found', 404);
        }
        res.status(200).json({
            status: 'success',
            data: {
                product,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProduct = getProduct;
// Create new product
const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                product,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
// Update product
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            throw new error_middleware_1.AppError('Product not found', 404);
        }
        res.status(200).json({
            status: 'success',
            data: {
                product,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
// Delete product
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            throw new error_middleware_1.AppError('Product not found', 404);
        }
        res.status(204).json({
            status: 'success',
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
