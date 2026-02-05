"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWishlistStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
exports.useWishlistStore = (0, zustand_1.create)()((0, middleware_1.persist)((set) => ({
    wishlist: [],
    lastSync: null,
    actions: {
        setWishlist: (games) => {
            set({ wishlist: games });
        },
        clearWishlist: () => {
            set({ wishlist: [], lastSync: null });
        },
        setLastSync: (date) => {
            set({ lastSync: date });
        }
    }
}), {
    name: 'wishlist-storage',
    partialize: (state) => ({
        wishlist: state.wishlist,
        lastSync: state.lastSync
    })
}));
