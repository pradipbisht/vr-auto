import React, { useState, useMemo, useEffect } from "react";
import { useStore } from "../api/store";
import { Link } from "react-router-dom";

// Sort icon helper
const SortIcon = ({ direction }) => {
  if (!direction) return null;
  return direction === "ascending" ? <span>▲</span> : <span>▼</span>;
};

function Dashboard() {
  const { coins, loadingCoins, fetchCoins } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "marketCap",
    direction: "descending",
  });

  useEffect(() => {
    fetchCoins();
    const intervalId = setInterval(fetchCoins, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchCoins]);

  const filteredAndSortedCoins = useMemo(() => {
    let sortableCoins = [...coins];

    if (searchTerm) {
      sortableCoins = sortableCoins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      sortableCoins.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableCoins;
  }, [coins, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  if (loadingCoins && coins.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-lg text-gray-500">
          Loading Cryptocurrencies...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Crypto-<span className="text-amber-500 uppercase">Tracker</span>
        </h1>
      </div>

      {/* Controls: Search and Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or symbol..."
          className="w-full md:flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Sort Controls */}
        <div className="flex items-center justify-center gap-2 p-1 bg-gray-100 rounded-lg">
          {["name", "price", "marketCap", "priceChange24h"].map((key) => (
            <button
              key={key}
              onClick={() => requestSort(key)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-300 ${
                sortConfig.key === key
                  ? "bg-cyan-500 text-white shadow"
                  : "text-gray-600 hover:bg-gray-200"
              }`}>
              Sort by{" "}
              {key
                .replace(/([A-Z])/g, " $1")
                .replace("price Change24h", "24h %")
                .trim()}
              {sortConfig.key === key && (
                <SortIcon direction={sortConfig.direction} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Crypto Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAndSortedCoins.map((coin) => (
          <Link
            to={`/coin/${coin.coinId}`}
            key={coin.coinId}
            className="block bg-white rounded-lg p-4 shadow-md hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-cyan-500 transition-all duration-300 ease-in-out">
            <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-4">
              {/* 1. Coin Identity */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-cyan-600">
                  {coin.symbol.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{coin.name}</p>
                  <p className="text-sm text-gray-500">
                    {coin.symbol.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* 2. Price */}
              <div className="text-left md:text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Price
                </p>
                <p className="text-base font-semibold font-mono text-gray-800">
                  ${coin.price.toLocaleString()}
                </p>
              </div>

              {/* 3. Market Cap */}
              <div className="text-left md:text-center hidden md:block">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Market Cap
                </p>
                <p className="text-base font-semibold font-mono text-gray-800">
                  ${coin.marketCap.toLocaleString()}
                </p>
              </div>

              {/* 4. 24h Change */}
              <div className="text-left md:text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  24h %
                </p>
                <p
                  className={`text-base font-bold ${
                    coin.priceChange24h < 0 ? "text-red-500" : "text-green-600"
                  }`}>
                  {coin.priceChange24h.toFixed(2)}%
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
