"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Public routes
router.post('/register', auth_controller_1.registerValidation, auth_controller_1.register);
router.post('/login', auth_controller_1.loginValidation, auth_controller_1.login);
// Protected routes
router.get('/me', auth_middleware_1.protect, auth_controller_1.getCurrentUser);
exports.default = router;
