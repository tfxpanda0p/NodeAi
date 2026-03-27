const rateLimit = require('express-rate-limit');

// Global rate limiter: 200 requests per 15 minutes per IP
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
});

// Sensitive route protector: 20 attempts per 15 minutes per IP
const sensitiveLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { globalLimiter, sensitiveLimiter };