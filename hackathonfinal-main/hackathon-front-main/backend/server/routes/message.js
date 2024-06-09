const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Define the path to your JSON file
const filePath = path.join(__dirname, '../data/message.json');

router.get('/random-message', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ message: 'Server Error: Unable to read file' });
    }
    const messages = JSON.parse(data);
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    res.json({ message: randomMessage });
  });
});

module.exports = router;
