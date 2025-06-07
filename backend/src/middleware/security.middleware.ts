import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import config from '../config';

// Rate limiting
export const limiter = rateLimit(config.rateLimit);

// Security headers
export const securityHeaders = helmet();

// Data sanitization against NoSQL query injection
export const sanitizeData = mongoSanitize();

// Data sanitization against XSS
export const preventXss = xss();

// Prevent parameter pollution
export const preventParamPollution = hpp({
  whitelist: [
    'price',
    'rating',
    'category',
    'brand',
    // Add other fields that might need to be duplicated in query string
  ],
}); 