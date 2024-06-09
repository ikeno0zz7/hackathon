require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./server/config/db');
const authRoutes = require('./server/routes/auth');
const mainRoutes = require('./server/routes/main');
const messageRoutes = require('./server/routes/message');
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json()); // Ensure the app can parse JSON
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use('/api/auth', authRoutes);
app.use('/api/v1', mainRoutes);
app.use('/api/v2', messageRoutes);


require('./server/cron'); 

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
