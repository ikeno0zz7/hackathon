
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // Register user
// const registerUser = async (req, res) => {
//   const { email, password } = req.body;

//   console.log('Received registration request with email:', email);

//   if (!email || !password) {
//     return res.status(400).json({ msg: 'Please provide email and password' });
//   }

//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       console.log('User already exists with email:', email);
//       return res.status(400).json({ msg: 'User already exists' });
//     }

//     user = new User({ email, password });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     console.log('User registered successfully with email:', email);
//     const payload = { user: { _id: user._id } };

//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

//     res.json({ token });
//   } catch (err) {
//     console.error('Server error during registration:', err.message);
//     res.status(500).send('Server error');
//   }
// };

// // Login user
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const payload = { user: { _id: user._id } };

//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.json({ token });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// module.exports = { registerUser, loginUser };

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  const payload = {
    user: {
      _id: user._id
    }
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register user
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      email,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Generate JWT token
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const user = await User.findById(decoded.user._id).select('-password');

    if (!user) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    const newToken = generateToken(user);
    res.json({ token: newToken });
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken
};
