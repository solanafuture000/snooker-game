const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = "snooker_super_secret";

// 🔐 Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, walletAddress, referrerId } = req.body;

    if (!username || !email || !password || !walletAddress) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    // Check if wallet already used
    const existingWallet = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (existingWallet) return res.status(400).json({ message: "Wallet already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashed,
      walletAddress: walletAddress.toLowerCase(),
      referrer: referrerId || null
    });

    await newUser.save();
    res.json({ message: "✅ Registered successfully" });

  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔐 Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        chips: user.chips,
        walletAddress: user.walletAddress,
        referrer: user.referrer
      }
    });

  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
