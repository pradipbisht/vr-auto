const express = require("express");
const connectDB = require("./config/db.js");
const cors = require("cors");
const morgan = require("morgan");
const setupCron = require("./utils/automation.js");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Initialize Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json({ extended: false })); // Allows us to accept JSON data in the body
app.use(morgan("dev"));

// Define API Routes
app.use("/api/coins", require("./routes/coinRoutes.js"));
app.use("/api/history", require("./routes/historyRoutes.js"));

// Welcome Route
app.get("/", (req, res) => res.send("Crypto Tracker API Running"));

// Setup and start the hourly cron job
console.log("🕒 Setting up hourly cron job...");
setupCron();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
