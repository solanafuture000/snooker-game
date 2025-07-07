const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Routes Import
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const gameRoutes = require('./routes/game');
const withdrawRoutes = require('./routes/withdraw'); // 💸 Withdraw logic

// ✅ Use Routes
app.use('/api/auth', authRoutes);          // 🔐 Register/Login
app.use('/api/user', userRoutes);          // 👤 User Profile, Chips
app.use('/api/game', gameRoutes);          // 🎮 Game Logic, Wins
app.use('/api/withdraw', withdrawRoutes);  // 💸 Withdraw endpoint

// ✅ MongoDB Connection (Clean, modern way)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
