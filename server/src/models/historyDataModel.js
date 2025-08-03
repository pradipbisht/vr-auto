const mongoose = require("mongoose");

const HistoryDataSchema = new mongoose.Schema({
  coinId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  marketCap: {
    type: Number,
    required: true,
  },
  priceChange24h: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Important for tracking history
  },
});

module.exports = mongoose.model("HistoryData", HistoryDataSchema);
