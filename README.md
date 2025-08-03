# Full Stack Crypto Tracker

This is a full-stack web application built for the VR Automations developer test. It provides a real-time dashboard to track the top 10 cryptocurrencies, featuring live data, historical price charts, search, and sorting functionalities.

---

## Tech Stack

This project was built using the **MERN** stack:

- **MongoDB:** NoSQL database for storing current and historical coin data, hosted on MongoDB Atlas.
- **Express.js:** Backend framework for building the RESTful API.
- **React:** Frontend library for building the user interface.
- **Node.js:** JavaScript runtime environment for the backend server.

**Key Libraries & Tools:**

- **Frontend:**
  - **Zustand:** For lightweight, modern state management.
  - **Axios:** For making HTTP requests to the backend API.
  - **Tailwind CSS:** For utility-first styling and a clean UI.
  - **React Router:** For client-side routing.
  - **Chart.js:** For rendering historical price charts.
- **Backend:**
  - **Mongoose:** As an ODM for modeling and interacting with the MongoDB database.
  - **Node-Cron:** For scheduling the automated task of fetching and storing historical data.
  - **Morgan:** For logging HTTP requests during development.
  - **Dotenv:** For managing environment variables.

---

## Features

- **Live Data Dashboard:** Displays the top 10 cryptocurrencies with key metrics, auto-refreshing every 30 minutes.
- **Search Functionality:** Instantly filter the list of coins by name or symbol.
- **Dynamic Sorting:** Sort the data by name, price, market cap, or 24h % change in ascending or descending order.
- **Historical Price Charts:** Click on any cryptocurrency to view a chart of its price history, based on hourly snapshots.
- **Automated Data Collection:** A background cron job runs every hour to fetch the latest data from the CoinGecko API and store it as a historical record.
- **Responsive UI:** The application is styled with Tailwind CSS for a seamless experience on both desktop and mobile devices.

---

## Challenges Faced & Solutions

During development, several challenges were encountered and resolved, demonstrating key debugging and problem-solving skills.

### 1. Challenge: Empty `historydatas` Collection

- **Problem:** The `currentdatas` collection was being populated correctly, but the `historydatas` collection remained empty, even though the cron job appeared to be running. The `GET /api/history/:coinId` endpoint always returned a `404 Not Found`.
- **Investigation:** The cron job's `try...catch` block was catching an error and logging a generic message, but not crashing the server. This meant the `HistoryData.insertMany()` command was never being successfully executed.
- **Solution:** An isolated test script (`test-history.js`) was created to run only the history-saving logic. This immediately exposed a `ValidationError` from Mongoose, revealing the root cause.

### 2. Challenge: Mongoose Schema Validation Error

- **Problem:** The test script revealed the error: `HistoryData validation failed: lastUpdated: Path 'lastUpdated' is required`.
- **Investigation:** The `historyDataModel.js` schema was incorrectly defined with a required `lastUpdated` field. However, the `automation.js` script was not providing this field; it was designed to let the database generate a `timestamp` automatically.
- **Solution:** The `HistoryData` schema was corrected by removing the `lastUpdated` field and ensuring it had a `timestamp` field with a `default: Date.now` value. This aligned the schema with the data being saved by the cron job, resolving the error.

### 3. Challenge: Frontend `AxiosError` and 404s

- **Problem:** The frontend chart component was failing with a generic `AxiosError` when trying to fetch historical data. The browser's network tab showed a `GET /api/history/Bitcoins 404 Not Found` error.
- **Investigation:** The `coinId` for Bitcoin is `bitcoin` (lowercase). The frontend was, for some reason, requesting an incorrect, capitalized, and pluralized ID (`Bitcoins`).
- **Solution:** The issue was traced back to ensuring the correct, case-sensitive `coinId` from the state was used in the `Link` component and the subsequent API call. This reinforced the importance of data consistency between the frontend and backend.

### 4. Challenge: Chart.js Filler Plugin Error

- **Problem:** The line chart rendered, but an error appeared in the console: `Tried to use the 'fill' option without the 'Filler' plugin enabled.` The colored background under the line was missing.
- **Investigation:** Newer versions of Chart.js require explicit registration for plugins that are not part of the core. The `fill: true` option relies on the `Filler` plugin.
- **Solution:** The `Filler` plugin was imported from the `chart.js` library and registered alongside the other components (`ChartJS.register(..., Filler)`). This immediately resolved the error and enabled the background fill on the chart.

---

## How It Works

### Backend

The backend is built with Express.js and provides a REST API for the frontend.

- **`GET /api/coins`**: Fetches live data for the top 10 coins from the CoinGecko API. It then overwrites the `currentdatas` collection in MongoDB with this fresh data and returns it to the client.
- **`GET /api/history/:coinId`**: Retrieves all historical price snapshots for a specific coin from the `historydatas` collection.
- **`POST /api/history`**: An endpoint that is not intended for direct use, as history is saved automatically.

### Automation (Cron Job)

The `automation.js` file uses the `node-cron` library to schedule a task.

- **Schedule:** The cron job is configured to run at the top of every hour (`'0 * * * *'`).
- **Action:** When triggered, the `fetchDataAndStore` function executes. It calls the CoinGecko API, formats the data for the top 10 coins, and inserts these records into the `historydatas` collection in MongoDB. Each record is automatically assigned a `timestamp` by the database.

---

## Setup and Installation

To run this project locally, follow these steps:

### Prerequisites

- Node.js (v18 or later)
- npm
- A free MongoDB Atlas account

### 1. Clone the Repository

```bash
git clone [https://github.com/](https://github.com/)[YOUR_USERNAME]/[YOUR_REPO_NAME].git
cd [YOUR_REPO_NAME]

2. Backend Setup
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file in the /server root and add your MongoDB connection string
echo "MONGO_URI=your_mongodb_atlas_connection_string" > .env

# Start the backend server
npm run dev

The backend will be running on http://localhost:5000.

3. Frontend Setup
# Navigate to the client directory from the root
cd client

# Install dependencies
npm install

# Start the React development server
npm start

The frontend will open and run on http://localhost:3000.

Folder Structure
/
├── client/         # React Frontend
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── store.js      # Zustand state management
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   └── CoinChart.jsx
│       ├── App.jsx
│       └── index.js
├── server/         # Node.js & Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Database connection
│   │   ├── models/
│   │   │   ├── currentDataModel.js
│   │   │   └── historyDataModel.js
│   │   ├── routes/
│   │   │   ├── coinRoutes.js
│   │   │   └── historyRoutes.js
│   │   ├── utils/
│   │   │   └── automation.js   # Cron job logic
│   │   └── index.js            # Main server file
│   ├── .env                # Environment variables (local)
│   └── package.json
└── README.md
```
