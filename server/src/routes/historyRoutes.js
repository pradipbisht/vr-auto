const express = require("express");
const router = express.Router();
const axios = require("axios");
const HistoryData = require("../models/historyDataModel.js");

// @desc    Manually trigger saving a history snapshot (optional)
router.post("/", async (req, res) => {
  // This logic is primarily handled by the cron job,
  // but an endpoint can be useful for testing.
  res
    .status(400)
    .send(
      "This endpoint is not intended for direct use. History is saved automatically."
    );
});

router.get("/", async (req, res) => {
  try {
    const allHistory = await HistoryData.find({});
    res.json(allHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @desc    Return historical price data for the specified coin
router.get("/:coinId", async (req, res) => {
  try {
    const data = await HistoryData.find({ coinId: req.params.coinId });
    if (!data || data.length === 0) {
      return res.status(404).json({ msg: "No history found for this coin." });
    }
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// router.get("/test/manual-save", async (req, res) => {
//   try {
//     const url =
//       "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

//     const response = await axios.get(url);
//     const coins = response.data.map((coin) => ({
//       coinId: coin.id,
//       name: coin.name,
//       symbol: coin.symbol,
//       price: coin.current_price,
//       marketCap: coin.market_cap,
//       priceChange24h: coin.price_change_percentage_24h,
//     }));

//     console.log("Inserting to DB:", coins); // Log the final data
//     await HistoryData.insertMany(coins);

//     res.json({ message: "Inserted history data manually!" });
//   } catch (err) {
//     console.error("❌ Insertion failed:", err.message);
//     res.status(500).send("Failed: " + err.message);
//   }
// });

module.exports = router;
