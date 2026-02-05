"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserStore = void 0;
const zustand_1 = require("zustand");
exports.useUserStore = (0, zustand_1.create)((set) => ({
    user: null,
    loading: false,
    error: null,
    setUser: (user) => set({ user, loading: false, error: null }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));
