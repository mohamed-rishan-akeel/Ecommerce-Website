"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const Order_js_1 = __importDefault(require("../models/Order.js"));
const Product_js_1 = __importDefault(require("../models/Product.js"));
const auth_js_1 = require("../middleware/auth.js");
const stripe_1 = __importDefault(require("stripe"));
const router = express_1.default.Router();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});
// Get all orders (Admin only)
router.get('/', auth_js_1.adminAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const query = {};
        if (status) {
            query.status = status;
        }
        const total = await Order_js_1.default.countDocuments(query);
        const orders = await Order_js_1.default.find(query)
            .populate('user', 'name email')
            .populate('items.product', 'name price')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        res.json({
            orders,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalOrders: total,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Get user's orders
router.get('/my-orders', auth_js_1.auth, async (req, res) => {
    try {
        const orders = await Order_js_1.default.find({ user: req.user._id })
            .populate('items.product', 'name price images')
            .sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Get single order
router.get('/:id', auth_js_1.auth, async (req, res) => {
    try {
        const order = await Order_js_1.default.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name price images');
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // Check if user is admin or order belongs to user
        if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Create new order
router.post('/', auth_js_1.auth, [
    (0, express_validator_1.body)('items').isArray().withMessage('Items must be an array'),
    (0, express_validator_1.body)('items.*.product').notEmpty().withMessage('Product ID is required'),
    (0, express_validator_1.body)('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    (0, express_validator_1.body)('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    (0, express_validator_1.body)('paymentMethod').isIn(['stripe', 'cod']).withMessage('Invalid payment method'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Validate products and calculate total
        const items = await Promise.all(req.body.items.map(async (item) => {
            const product = await Product_js_1.default.findById(item.product);
            if (!product) {
                throw new Error(`Product ${item.product} not found`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }
            return {
                product: item.product,
                quantity: item.quantity,
                price: product.price,
            };
        }));
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        // Create order
        const order = new Order_js_1.default({
            user: req.user._id,
            items,
            totalAmount,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
        });
        // If payment method is Stripe, create payment intent
        if (req.body.paymentMethod === 'stripe') {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(totalAmount * 100), // Convert to cents
                currency: 'usd',
                metadata: {
                    orderId: order._id.toString(),
                },
            });
            // Save order and update product stock
            await order.save();
            await Promise.all(items.map(item => Product_js_1.default.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            })));
            res.status(201).json({
                order,
                clientSecret: paymentIntent.client_secret,
            });
        }
        else {
            // For COD, just save the order
            await order.save();
            await Promise.all(items.map(item => Product_js_1.default.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            })));
            res.status(201).json({ order });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Update order status (Admin only)
router.patch('/:id/status', auth_js_1.adminAuth, [
    (0, express_validator_1.body)('status')
        .isIn(['processing', 'shipped', 'delivered'])
        .withMessage('Invalid status'),
], async (req, res) => {
    try {
        const order = await Order_js_1.default.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Cancel order
router.patch('/:id/cancel', auth_js_1.auth, async (req, res) => {
    try {
        const order = await Order_js_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // Check if user is authorized
        if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        // Check if order can be cancelled
        if (order.status !== 'pending' && order.status !== 'processing') {
            return res.status(400).json({ error: 'Order cannot be cancelled' });
        }
        // Restore product stock
        await Promise.all(order.items.map(item => Product_js_1.default.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
        })));
        // If payment was made with Stripe, process refund
        if (order.paymentMethod === 'stripe' && order.paymentStatus === 'paid') {
            // TODO: Implement Stripe refund
        }
        order.status = 'cancelled';
        await order.save();
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
