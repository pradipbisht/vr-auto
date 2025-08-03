const express = require("express");
const router = express.Router();
const axios = require("axios");
const CurrentData = require("../models/currentDataModel.js");

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

// @route   GET /api/coins
// @desc    Get top 10 cryptocurrencies and refresh CurrentData
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(COINGECKO_URL);

    const formattedData = response.data.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      priceChange24h: coin.price_change_percentage_24h,
      lastUpdated: coin.last_updated,
    }));

    // Overwrite the CurrentData collection
    await CurrentData.deleteMany({});
    await CurrentData.insertMany(formattedData);

    res.json(formattedData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
