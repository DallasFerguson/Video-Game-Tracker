const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  authController.register
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, authController.getCurrentUser);

// @route   PUT /api/auth/me
// @desc    Update user profile
// @access  Private
router.put(
  '/me',
  [
    auth,
    check('username', 'Username is required').optional().notEmpty(),
    check('email', 'Please include a valid email').optional().isEmail()
  ],
  authController.updateProfile
);

module.exports = router;