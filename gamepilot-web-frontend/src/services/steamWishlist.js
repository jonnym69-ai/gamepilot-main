"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSteamWishlist = fetchSteamWishlist;
async function fetchSteamWishlist(steamId) {
    try {
        const response = await fetch(`https://store.steampowered.com/wishlist/profiles/${steamId}/wishlistdata/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Check if wishlist is empty or private
        if (!data || Object.keys(data).length === 0) {
            return [];
        }
        // Parse the wishlist data object
        const wishlistItems = [];
        Object.entries(data).forEach(([, item]) => {
            if (item && item.name && item.appid) {
                const parsedItem = {
                    appId: item.appid,
                    name: item.name,
                    capsuleImage: item.capsule_image || item.small_header_image || item.header_image,
                    price: item.price_overview ? {
                        currency: item.price_overview.currency,
                        initial: item.price_overview.initial,
                        final: item.price_overview.final,
                        discount_percent: item.price_overview.discount_percent,
                        initial_formatted: item.price_overview.initial_formatted,
                        final_formatted: item.price_overview.final_formatted
                    } : undefined,
                    releaseDate: item.release_date,
                    tags: item.tags || [],
                    isFree: item.is_free_game || false
                };
                wishlistItems.push(parsedItem);
            }
        });
        return wishlistItems;
    }
    catch (error) {
        console.warn(`Failed to fetch Steam wishlist for user ${steamId}:`, error);
        // Check if it's a private wishlist (common error)
        if (error instanceof Error && error.message.includes('403')) {
            console.info('Steam wishlist is private or not accessible');
        }
        return [];
    }
}
