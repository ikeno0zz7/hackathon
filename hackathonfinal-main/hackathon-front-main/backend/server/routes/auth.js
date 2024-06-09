const express = require('express');
const { registerUser, loginUser, refreshToken } = require('../controllers/authControllers');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken); // Refresh token endpoint

module.exports = router;
