import { create } from "zustand";
import axios from "axios";

const apiUrl = "http://localhost:5000";

export const useStore = create((set) => ({
  // State
  coins: [],
  history: [],
  loadingCoins: false,
  loadingHistory: false,
  error: null,

  // Actions
  fetchCoins: async () => {
    set({ loadingCoins: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}/api/coins`);
      set({ coins: response.data, loadingCoins: false });
    } catch (error) {
      console.error("Error fetching coins:", error);
      set({ error: "Failed to fetch coin data.", loadingCoins: false });
    }
  },

  fetchHistory: async (coinId) => {
    set({ loadingHistory: true, error: null, history: [] });
    try {
      const response = await axios.get(`${apiUrl}/api/history/${coinId}`);
      set({ history: response.data, loadingHistory: false });
    } catch (error) {
      console.error("Error fetching history:", error);
      set({
        error: `Failed to fetch history for ${coinId}.`,
        loadingHistory: false,
      });
    }
  },

  clearHistory: () => set({ history: [] }),
}));
