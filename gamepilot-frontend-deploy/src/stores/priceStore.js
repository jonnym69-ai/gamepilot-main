"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePriceStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
exports.usePriceStore = (0, zustand_1.create)()((0, middleware_1.persist)((set) => ({
    priceCache: {},
    lastUpdated: null,
    actions: {
        setPrice: (appId, price) => {
            set((state) => ({
                priceCache: { ...state.priceCache, [appId]: price },
                lastUpdated: new Date()
            }));
        },
        setPrices: (batch) => {
            set((state) => ({
                priceCache: { ...state.priceCache, ...batch },
                lastUpdated: new Date()
            }));
        },
        clearCache: () => {
            set({ priceCache: {}, lastUpdated: null });
        }
    }
}), {
    name: 'price-storage',
    partialize: (state) => ({
        priceCache: state.priceCache,
        lastUpdated: state.lastUpdated
    })
}));
