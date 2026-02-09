const rateLimit = require('express-rate-limit');
const timerFormatMs = require('../utils/timer-format')

// =======================
// Login Limiter
// =======================
const loginLimiter = rateLimit({
  windowMs: 7 * 60 * 1000, // 7 minutes
  max: 7,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime || (Date.now() + 7 * 60 * 1000);
    const remaining = resetTime - Date.now();
    res.status(429).json({
      message: `Too many login attempts. Please try again after ${timerFormatMs(remaining)}.`,
    });
  },
});

// =======================
// Send OTP Limiter
// =======================
const sendOtpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime || (Date.now() + 60 * 1000);
    const remaining = resetTime - Date.now();
    res.status(429).json({
      message: `Too many OTP requests. Please try again after ${timerFormatMs(remaining)}.`,
    });
  },
});

// =======================
// Verify OTP Limiter
// =======================
const verifyOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime || (Date.now() + 5 * 60 * 1000);
    const remaining = resetTime - Date.now();
    res.status(429).json({
      message: `Too many OTP verification attempts. Please try again after ${timerFormatMs(remaining)}.`,
    });
  },
});

// =======================
// Contact Limiter
// =======================
const contactLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime || (Date.now() + 60 * 1000);
    const remaining = resetTime - Date.now();
    res.status(429).json({
      message: `Too many contact requests. Please try again after ${timerFormatMs(remaining)}.`,
    });
  },
});

module.exports = {
  loginLimiter,
  sendOtpLimiter,
  verifyOtpLimiter,
  contactLimiter
};
