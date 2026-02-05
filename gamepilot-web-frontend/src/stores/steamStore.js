"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSteamStore = void 0;
const zustand_1 = require("zustand");
exports.useSteamStore = (0, zustand_1.create)((set) => ({
    recentlyPlayed: [],
    loading: false,
    error: null,
    setRecentlyPlayed: (recentlyPlayed) => set({ recentlyPlayed }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));
