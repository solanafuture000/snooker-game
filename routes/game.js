const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 🎯 Game win route - add chips & give referrer commission
router.post('/win', async (req, res) => {
  try {
    const { userId, winAmount } = req.body;

    // 🛑 Validate
    if (!userId || typeof winAmount !== 'number' || winAmount <= 0) {
      return res.status(400).json({ message: "Invalid userId or winAmount" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Add winAmount to user
    user.chips += winAmount;
    await user.save();

    let refBonus = 0;

    // 💸 If user has referrer, give 5% of winnings
    if (user.referrer) {
      const refUser = await User.findById(user.referrer);
      if (refUser) {
        refBonus = Math.floor(winAmount * 0.05);
        refUser.chips += refBonus;
        await refUser.save();

        console.log(`💰 Referrer ${refUser.username} earned ${refBonus} chips from ${user.username}`);
      }
    }

    res.json({
      success: true,
      message: `${winAmount} chips added to ${user.username}`,
      newBalance: user.chips,
      referrerBonus: refBonus
    });

  } catch (err) {
    console.error("❌ Error in /game/win:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
