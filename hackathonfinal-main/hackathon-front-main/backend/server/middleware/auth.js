
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// module.exports = async function (req, res, next) {
//   const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;

//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.user._id).select('-password'); // Fetch user details without password

//     if (!user) {
//       return res.status(401).json({ msg: 'Token is not valid' });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    console.log('Token received:', token); // Debugging statement
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded payload:', decoded); // Debugging statement

    if (!decoded.user || !decoded.user._id) {
      console.error('Decoded token does not contain user _id');
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    const user = await User.findById(decoded.user._id).select('-password'); // Fetch user details without password
    console.log('User found:', user); // Debugging statement

    if (!user) {
      console.error('No user found with this _id');
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    req.user = user;
    console.log('req.user set:', req.user); // Debugging statement
    next();
  } catch (err) {
    console.error('Error during token verification:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
