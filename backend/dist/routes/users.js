"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const User_js_1 = __importDefault(require("../models/User.js"));
const auth_js_1 = require("../middleware/auth.js");
const router = express_1.default.Router();
// Get all users (Admin only)
router.get('/', auth_js_1.adminAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        const total = await User_js_1.default.countDocuments(query);
        const users = await User_js_1.default.find(query)
            .select('-password')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        res.json({
            users,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalUsers: total,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Get user profile
router.get('/profile', auth_js_1.auth, async (req, res) => {
    try {
        const user = await User_js_1.default.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Update user profile
router.put('/profile', auth_js_1.auth, [
    (0, express_validator_1.body)('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Please enter a valid email'),
    (0, express_validator_1.body)('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('address').optional().isObject().withMessage('Address must be an object'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const updates = { ...req.body };
        delete updates.role; // Prevent role update through this route
        // If updating email, check if it's already taken
        if (updates.email) {
            const existingUser = await User_js_1.default.findOne({
                email: updates.email,
                _id: { $ne: req.user._id },
            });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already in use' });
            }
        }
        const user = await User_js_1.default.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        }).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Add item to wishlist
router.post('/wishlist', auth_js_1.auth, [(0, express_validator_1.body)('productId').notEmpty().withMessage('Product ID is required')], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await User_js_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const productId = new mongoose_1.default.Types.ObjectId(req.body.productId);
        if (user.wishlist.includes(productId)) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }
        user.wishlist.push(productId);
        await user.save();
        res.json(user.wishlist);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Remove item from wishlist
router.delete('/wishlist/:productId', auth_js_1.auth, async (req, res) => {
    try {
        const user = await User_js_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const productId = req.params.productId;
        const index = user.wishlist.indexOf(productId);
        if (index === -1) {
            return res.status(400).json({ error: 'Product not in wishlist' });
        }
        user.wishlist.splice(index, 1);
        await user.save();
        res.json(user.wishlist);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Get user's wishlist
router.get('/wishlist', auth_js_1.auth, async (req, res) => {
    try {
        const user = await User_js_1.default.findById(req.user._id)
            .select('wishlist')
            .populate('wishlist', 'name price images');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.wishlist);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Update user role (Admin only)
router.patch('/:id/role', auth_js_1.adminAuth, [(0, express_validator_1.body)('role').isIn(['user', 'admin']).withMessage('Invalid role')], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await User_js_1.default.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Delete user (Admin only)
router.delete('/:id', auth_js_1.adminAuth, async (req, res) => {
    try {
        const user = await User_js_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
