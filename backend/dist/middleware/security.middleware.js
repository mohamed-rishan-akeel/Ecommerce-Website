"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preventParamPollution = exports.preventXss = exports.sanitizeData = exports.securityHeaders = exports.limiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const hpp_1 = __importDefault(require("hpp"));
const config_1 = __importDefault(require("../config"));
// Rate limiting
exports.limiter = (0, express_rate_limit_1.default)(config_1.default.rateLimit);
// Security headers
exports.securityHeaders = (0, helmet_1.default)();
// Data sanitization against NoSQL query injection
exports.sanitizeData = (0, express_mongo_sanitize_1.default)();
// Data sanitization against XSS
exports.preventXss = (0, xss_clean_1.default)();
// Prevent parameter pollution
exports.preventParamPollution = (0, hpp_1.default)({
    whitelist: [
        'price',
        'rating',
        'category',
        'brand',
        // Add other fields that might need to be duplicated in query string
    ],
});
