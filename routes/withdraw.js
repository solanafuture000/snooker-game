const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 🔁 Convert chips to USDT (100 chips = 1 USDT)
const CHIPS_TO_USDT = 100;
const MIN_USDT = 5;
const FEE_PERCENT = 0.01; // 1%

router.post('/request', async (req, res) => {
  try {
    const { userId, withdrawAddress } = req.body;

    if (!userId || !withdrawAddress) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userChips = user.chips;
    const usdtAmount = userChips / CHIPS_TO_USDT;

    // Check minimum
    if (usdtAmount < MIN_USDT) {
      return res.status(400).json({ message: "Minimum 5 USDT required to withdraw" });
    }

    // Fee calculation
    const fee = usdtAmount * FEE_PERCENT;
    const finalUSDT = usdtAmount - fee;
    const deductedChips = Math.floor(usdtAmount * CHIPS_TO_USDT);

    // Deduct chips from user
    user.chips -= deductedChips;
    await user.save();

    // Log or store withdraw request
    console.log(`💸 Withdraw Requested: ${finalUSDT.toFixed(2)} USDT`);
    console.log(`➡️ To Wallet: ${withdrawAddress}`);
    console.log(`👤 User: ${user.username}, Fee: ${fee.toFixed(2)} USDT`);

    // TODO: Save in WithdrawRequests model or notify admin
    res.json({
      message: `✅ Withdraw request received`,
      usdt: finalUSDT.toFixed(2),
      fee: fee.toFixed(2),
      wallet: withdrawAddress
    });

  } catch (err) {
    console.error("❌ Withdraw Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
