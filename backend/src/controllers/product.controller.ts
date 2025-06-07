import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';
import { Product } from '../models/Product';

// Static products data
const products = [
  {
    _id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality',
    price: 199.99,
    category: 'Electronics',
    stock: 50,
    image: '/src/assets/images/black headphone.jpg',
    rating: 4.5,
    numReviews: 12
  },
  {
    _id: '2',
    name: 'Smart Watch Pro',
    description: 'Feature-rich smartwatch with health tracking, notifications, and long battery life',
    price: 299.99,
    category: 'Electronics',
    stock: 30,
    image: '/src/assets/images/Smartwatches.jpg',
    rating: 4.2,
    numReviews: 8
  },
  {
    _id: '3',
    name: 'Gaming Laptop Elite',
    description: 'Powerful gaming laptop with high-performance graphics and premium display',
    price: 1299.99,
    category: 'Computers',
    stock: 15,
    image: '/src/assets/images/laptop.jpg',
    rating: 4.8,
    numReviews: 25
  },
  {
    _id: '4',
    name: 'Wireless Gaming Controller',
    description: 'Ergonomic gaming controller with precision controls and wireless connectivity',
    price: 59.99,
    category: 'Accessories',
    stock: 100,
    image: '/src/assets/images/joy stick black.jpg',
    rating: 4.3,
    numReviews: 45
  },
  {
    _id: '5',
    name: 'Premium SSD Drive',
    description: 'High-speed solid state drive for faster data access and improved performance',
    price: 129.99,
    category: 'Computers',
    stock: 40,
    image: '/src/assets/images/Ssd.jpg',
    rating: 4.6,
    numReviews: 32
  }
];

// Get all products
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single product
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = products.find(p => p._id === req.params.id);
    
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create new product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}; 