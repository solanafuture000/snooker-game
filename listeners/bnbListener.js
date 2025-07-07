 📁 bnbListener.js
const Web3 = require('web3');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('.modelsUser');

 ✅ Web3 Setup
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BNB_RPC));
const usdtAddress = process.env.USDT_CONTRACT;
const gameWallet = process.env.GAME_WALLET.toLowerCase();

 🧠 USDT BEP-20 ABI (only Transfer event)
const abi = [
  {
    anonymous false,
    inputs [
      { indexed true, name from, type address },
      { indexed true, name to, type address },
      { indexed false, name value, type uint256 }
    ],
    name Transfer,
    type event,
    typeSignature Transfer(address,address,uint256)
  }
];

 ✅ MongoDB Connect
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser true,
  useUnifiedTopology true
}).then(() = {
  console.log(✅ MongoDB Connected);
}).catch((err) = {
  console.error(❌ MongoDB Error, err);
});

 📦 Create contract
const usdt = new web3.eth.Contract(abi, usdtAddress);

 ✅ Listen to USDT Transfers to Game Wallet
async function listenToTransfers() {
  console.log(🎧 Listening to USDT transfers...);

  usdt.events.Transfer({ fromBlock 'latest' })
    .on('data', async (event) = {
