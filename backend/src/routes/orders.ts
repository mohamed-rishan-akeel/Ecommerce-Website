import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { auth, adminAuth } from '../middleware/auth.js';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Get all orders (Admin only)
router.get('/', adminAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
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
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req: Request & { user?: any }, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req: Request & { user?: any }, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
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
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new order
router.post(
  '/',
  auth,
  [
    body('items').isArray().withMessage('Items must be an array'),
    body('items.*.product').notEmpty().withMessage('Product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('paymentMethod').isIn(['stripe', 'cod']).withMessage('Invalid payment method'),
  ],
  async (req: Request & { user?: any }, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Validate products and calculate total
      const items = await Promise.all(
        req.body.items.map(async (item: any) => {
          const product = await Product.findById(item.product);
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
        })
      );

      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Create order
      const order = new Order({
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
        await Promise.all(
          items.map(item =>
            Product.findByIdAndUpdate(item.product, {
              $inc: { stock: -item.quantity },
            })
          )
        );

        res.status(201).json({
          order,
          clientSecret: paymentIntent.client_secret,
        });
      } else {
        // For COD, just save the order
        await order.save();
        await Promise.all(
          items.map(item =>
            Product.findByIdAndUpdate(item.product, {
              $inc: { stock: -item.quantity },
            })
          )
        );

        res.status(201).json({ order });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Update order status (Admin only)
router.patch(
  '/:id/status',
  adminAuth,
  [
    body('status')
      .isIn(['processing', 'shipped', 'delivered'])
      .withMessage('Invalid status'),
  ],
  async (req: Request, res: Response) => {
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Cancel order
router.patch(
  '/:id/cancel',
  auth,
  async (req: Request & { user?: any }, res: Response) => {
    try {
      const order = await Order.findById(req.params.id);

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
      await Promise.all(
        order.items.map(item =>
          Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          })
        )
      );

      // If payment was made with Stripe, process refund
      if (order.paymentMethod === 'stripe' && order.paymentStatus === 'paid') {
        // TODO: Implement Stripe refund
      }

      order.status = 'cancelled';
      await order.save();

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router; 