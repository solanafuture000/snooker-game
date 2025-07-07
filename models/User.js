const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },

  // ✅ User’s USDT deposit wallet (BNB or TRON)
  walletAddress: { type: String, required: true, unique: true },

  // ✅ Chips (game currency)
  chips: { type: Number, default: 0 },

  // 💰 Optional: Fake balance for testing or leaderboard
  balance: { type: Number, default: 1000 },

  // 🪙 Used to track if first deposit cashback given
  hasDeposited: { type: Boolean, default: false },

  // 🔁 Referral system
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  // ✅ Track via Binance Pay if used
  binancePayUsed: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
