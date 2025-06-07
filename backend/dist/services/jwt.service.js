"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
class JwtService {
    static generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN,
        });
    }
    static verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
    static extractTokenFromHeader(header) {
        if (!header || !header.startsWith('Bearer ')) {
            throw new Error('No token provided or invalid format');
        }
        return header.split(' ')[1];
    }
}
JwtService.JWT_SECRET = config_1.default.jwtSecret || 'your-secret-key';
JwtService.JWT_EXPIRES_IN = '7d'; // 7 days
exports.default = JwtService;
