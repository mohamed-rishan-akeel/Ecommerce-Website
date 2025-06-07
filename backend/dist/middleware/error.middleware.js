"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = exports.AppError = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const notFoundHandler = (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (err, req, res, next) => {
    let error = err instanceof AppError ? err : new AppError(err.message, 500);
    // Mongoose Validation Error
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        const messages = Object.values(err.errors).map((val) => val.message);
        error = new AppError(messages.join('. '), 400);
    }
    // Mongoose Duplicate Key Error
    if (err.name === 'MongoServerError' && err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error = new AppError(`Duplicate field value: ${field}. Please use another value!`, 400);
    }
    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        error = new AppError('Invalid token. Please log in again!', 401);
    }
    if (err.name === 'TokenExpiredError') {
        error = new AppError('Your token has expired! Please log in again.', 401);
    }
    // Development error response
    if (process.env.NODE_ENV === 'development') {
        res.status(error.statusCode).json({
            status: error.status,
            error: error,
            message: error.message,
            stack: error.stack,
        });
    }
    // Production error response
    else {
        // Operational, trusted error: send message to client
        if (error.isOperational) {
            res.status(error.statusCode).json({
                status: error.status,
                message: error.message,
            });
        }
        // Programming or other unknown error: don't leak error details
        else {
            console.error('ERROR 💥', error);
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong!',
            });
        }
    }
};
exports.errorHandler = errorHandler;
