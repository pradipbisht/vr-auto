import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useStore } from "../api/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CoinChart = () => {
  const { coinId } = useParams();
  const { history, loadingHistory, fetchHistory, clearHistory } = useStore();

  useEffect(() => {
    fetchHistory(coinId);
    return () => clearHistory(); // Cleanup on unmount
  }, [coinId, fetchHistory, clearHistory]);

  const chartData = {
    labels: history.map((item) =>
      new Date(item.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    ),
    datasets: [
      {
        label: "Price (USD)",
        data: history.map((item) => item.price),
        borderColor: "#22d3ee", // Tailwind cyan-400
        backgroundColor: "rgba(34, 211, 238, 0.1)",
        tension: 0.3,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Price History - ${coinId.toUpperCase()}`,
        color: "#e5e7eb", // gray-200
        font: {
          size: 20,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "#1f2937", // gray-800
        titleColor: "#fff",
        bodyColor: "#e5e7eb",
        padding: 10,
        cornerRadius: 4,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#9ca3af", // gray-400
          font: {
            size: 13,
          },
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
      y: {
        ticks: {
          color: "#9ca3af",
          font: {
            size: 14, // 👈 Increase this for clearer Y-axis labels
            weight: "500",
          },
          callback: function (value) {
            return "$" + value.toLocaleString();
          },
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };

  if (loadingHistory) {
    return (
      <div className="flex justify-center items-center h-64 text-lg text-gray-400">
        Loading Chart Data...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <Link
        to="/"
        className="text-cyan-400 hover:text-cyan-300 text-sm inline-block mb-6 transition-colors">
        ← Back to Dashboard
      </Link>

      <div className="bg-gray-900 rounded-xl p-4 sm:p-6 shadow-md border border-gray-800">
        {history.length > 0 ? (
          <div className="h-[400px] sm:h-[500px]">
            <Line options={chartOptions} data={chartData} />
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No historical data available yet. The server collects hourly
            snapshots.
          </p>
        )}
      </div>
    </div>
  );
};

export default CoinChart;
