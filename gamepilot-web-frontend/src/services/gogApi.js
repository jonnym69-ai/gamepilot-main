"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOGGameSearch = exports.GOGAPI = void 0;
class GOGAPI {
    static async searchGames(query, limit = 10) {
        try {
            const url = `${this.SEARCH_URL}?query=${encodeURIComponent(query)}&limit=${limit}&productType=game&sortBy=popularity&order=desc`;
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'GamePilot/1.0'
                }
            });
            if (!response.ok) {
                throw new Error(`GOG API Error: ${response.status}`);
            }
            const data = await response.json();
            if (data.products) {
                return data.products.map(this.transformGOGGame);
            }
            return [];
        }
        catch (error) {
            console.error('GOG Search Error:', error);
            return [];
        }
    }
    static async getGameDetails(gameId) {
        try {
            const url = `${this.BASE_URL}/products/${gameId}`;
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'GamePilot/1.0'
                }
            });
            if (!response.ok) {
                throw new Error(`GOG API Error: ${response.status}`);
            }
            const data = await response.json();
            return this.transformGOGGame(data);
        }
        catch (error) {
            console.error('GOG Game Details Error:', error);
            return null;
        }
    }
    static getGOGStoreUrl(gameId) {
        return `https://www.gog.com/game/${gameId}`;
    }
    static getGOGLauncherUrl(gameId) {
        return `goggalaxy://openGame/${gameId}`;
    }
    static transformGOGGame(gogData) {
        return {
            id: gogData.id || gogData.slug,
            title: gogData.title || gogData.name,
            slug: gogData.slug,
            url: gogData.url || `https://www.gog.com/game/${gogData.slug}`,
            image: gogData.coverHorizontal || gogData.image || gogData.cover,
            price: gogData.price?.amount || 'Free',
            developers: gogData.developers || [],
            genres: gogData.genres || [],
            platforms: gogData.platforms || [],
            releaseDate: gogData.releaseDate || gogData.release_date,
            description: gogData.description || gogData.summary || ''
        };
    }
    static convertGOGGameToGame(gogGame) {
        return {
            title: gogGame.title,
            launcherId: gogGame.id,
            platforms: ['GOG'],
            status: 'backlog',
            playtime: 0,
            coverImage: gogGame.image,
            genres: gogGame.genres,
            tags: [],
            achievements: { unlocked: 0, total: 0 },
            description: gogGame.description
        };
    }
    static extractGOGIdFromUrl(url) {
        const match = url.match(/gog\.com\/game\/([^\/\?]+)/);
        return match ? match[1] : null;
    }
    static extractGOGIdFromStoreUrl(url) {
        const match = url.match(/gog\.com\/en\/game\/([^\/\?]+)/);
        return match ? match[1] : null;
    }
}
exports.GOGAPI = GOGAPI;
GOGAPI.BASE_URL = 'https://api.gog.com/v2';
GOGAPI.SEARCH_URL = 'https://catalog.gog.com/v1/catalog';
// GOG Game Search Component Helper
class GOGGameSearch {
    static async searchWithCache(query) {
        const cacheKey = query.toLowerCase().trim();
        // Check cache first
        if (this.searchCache.has(cacheKey)) {
            return this.searchCache.get(cacheKey);
        }
        // Perform search
        const results = await GOGAPI.searchGames(query);
        // Cache results
        this.searchCache.set(cacheKey, results);
        // Clear cache after timeout
        setTimeout(() => {
            this.searchCache.delete(cacheKey);
        }, this.cacheTimeout);
        return results;
    }
    static clearCache() {
        this.searchCache.clear();
    }
}
exports.GOGGameSearch = GOGGameSearch;
GOGGameSearch.searchCache = new Map();
GOGGameSearch.cacheTimeout = 5 * 60 * 1000; // 5 minutes
