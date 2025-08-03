const cron = require("node-cron");
const axios = require("axios");
const HistoryData = require("../models/historyDataModel.js");

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

const fetchDataAndStore = async () => {
  try {
    console.log("📡 CRON: Fetching latest data from CoinGecko...");

    const response = await axios.get(COINGECKO_URL);
    const coinsData = response.data.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      priceChange24h: coin.price_change_percentage_24h,
    }));

    await HistoryData.insertMany(coinsData);
    console.log(
      `✅ CRON: Inserted ${coinsData.length} records into HistoryData.`
    );
  } catch (error) {
    console.error("❌ CRON ERROR:", error.message);
  }
};

const setupCron = () => {
  console.log("🕒 Setting up hourly cron job...");
  cron.schedule("0 * * * *", fetchDataAndStore, {
    scheduled: true,
    timezone: "UTC",
  });
};

module.exports = setupCron;
