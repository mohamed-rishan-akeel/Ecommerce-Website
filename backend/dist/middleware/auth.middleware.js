"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const error_middleware_1 = require("./error.middleware");
const jwt_service_1 = __importDefault(require("../services/jwt.service"));
const protect = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new error_middleware_1.AppError('No token provided', 401);
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new error_middleware_1.AppError('No token provided', 401);
        }
        // Verify token
        const decoded = jwt_service_1.default.verifyToken(token);
        if (!decoded) {
            throw new error_middleware_1.AppError('Invalid token', 401);
        }
        // Add user info to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.protect = protect;
// Middleware to restrict access to specific roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new error_middleware_1.AppError('Not authenticated. Please log in.', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new error_middleware_1.AppError('You do not have permission to perform this action.', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
