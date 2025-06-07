import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  registerValidation,
  loginValidation,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', protect, getCurrentUser);

export default router; 