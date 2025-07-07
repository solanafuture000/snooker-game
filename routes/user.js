const express = require('express');
const User = require('../models/User');
const router = express.Router();

/**
 * 💰 GET /api/user/chips/:id
 * ✅ Get user's chips balance
 */
router.get('/chips/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ chips: user.chips });
  } catch (err) {
    console.error("❌ Chips Route Error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

/**
 * 🧾 GET /api/user/profile/:id
 * ✅ Get full user profile (excluding password)
 */
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("❌ Profile Route Error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

/**
 * 🧮 GET /api/user/:id
 * ✅ General purpose user fetch (for dashboard)
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('username chips walletAddress');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      username: user.username,
      chips: user.chips,
      walletAddress: user.walletAddress
    });
  } catch (err) {
    console.error("❌ General User Fetch Error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;
