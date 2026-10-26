const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'urine_colorimetry_secret_key_2026');
      req.user = await User.findById(decoded.id).select('-password');
      if (req.user) {
        return next();
      }
    } catch (error) {
      // Fall through to default staff fallback
    }
  }

  // Fallback to default hospital staff (login-free operation)
  try {
    const defaultStaff = await User.findOne();
    if (defaultStaff) {
      req.user = defaultStaff;
      return next();
    }
  } catch (err) {
    console.error('[Auth Middleware Error]:', err.message);
  }

  next();
};

module.exports = { protect };
