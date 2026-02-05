"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWishlist = void 0;
const react_1 = require("react");
const wishlistStore_1 = require("../stores/wishlistStore");
const steamWishlist_1 = require("../services/steamWishlist");
const useWishlist = () => {
    const { wishlist, lastSync, actions } = (0, wishlistStore_1.useWishlistStore)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const syncWishlist = async (steamId) => {
        if (!steamId) {
            setError('Steam ID is required');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const wishlistData = await (0, steamWishlist_1.fetchSteamWishlist)(steamId);
            actions.setWishlist(wishlistData);
            actions.setLastSync(new Date());
        }
        catch (err) {
            setError('Failed to sync wishlist');
            console.error('Wishlist sync error:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const clearWishlist = () => {
        actions.clearWishlist();
        setError(null);
    };
    return {
        wishlist,
        isLoading,
        error,
        lastSync,
        syncWishlist,
        clearWishlist
    };
};
exports.useWishlist = useWishlist;
