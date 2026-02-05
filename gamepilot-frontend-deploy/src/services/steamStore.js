"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePriceInfo = parsePriceInfo;
exports.fetchSteamAppDetails = fetchSteamAppDetails;
exports.fetchSteamStoreData = fetchSteamStoreData;
function parsePriceInfo(storeData) {
    if (!storeData?.data?.price_overview) {
        return undefined;
    }
    const priceOverview = storeData.data.price_overview;
    return {
        currency: priceOverview.currency,
        initial: priceOverview.initial,
        final: priceOverview.final,
        discount_percent: priceOverview.discount_percent,
        isFree: storeData.data.is_free
    };
}
async function fetchSteamAppDetails(appId) {
    try {
        const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data[appId] || !data[appId].success) {
            throw new Error(`Failed to fetch app details for app ${appId}`);
        }
        return data[appId];
    }
    catch (error) {
        console.warn(`Failed to fetch Steam app details for app ${appId}:`, error);
        return null;
    }
}
async function fetchSteamStoreData(appId) {
    try {
        const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data[appId] || !data[appId].success) {
            throw new Error(`Failed to fetch store data for app ${appId}`);
        }
        return data[appId];
    }
    catch (error) {
        console.warn(`Failed to fetch Steam store data for app ${appId}:`, error);
        return null;
    }
}
