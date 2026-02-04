"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../services/database");
const identityService_1 = require("../identity/identityService");
const router = (0, express_1.Router)();
/**
 * GET /api/analytics/summary
 * Get real gaming statistics from the database
 * Budget-friendly: Direct SQL aggregation
 */
router.get('/summary', identityService_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        // 1. Get real games for this user
        const games = await database_1.databaseService.getUserGames(userId);
        // 2. Get real session history
        const sessions = await database_1.databaseService.getGameSessionHistory(userId, undefined, 1000);
        // 3. Calculate Real Aggregates
        const totalPlaytime = games.reduce((sum, g) => sum + (g.hoursPlayed || 0), 0);
        const averageSessionLength = sessions.length > 0
            ? sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length
            : 0;
        // 4. Calculate Mood Distribution
        const moodMap = {};
        games.forEach(g => {
            const gameMoods = g.moods || [];
            gameMoods.forEach((m) => {
                moodMap[m] = (moodMap[m] || 0) + 1;
            });
        });
        // Sort moods by frequency to find "Favorite"
        const favoriteMood = Object.entries(moodMap)
            .sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral';
        // Get Top 3 most played games
        const topGames = [...games]
            .sort((a, b) => (b.hoursPlayed || 0) - (a.hoursPlayed || 0))
            .slice(0, 3)
            .map(g => ({ title: g.title, hours: Math.round(g.hoursPlayed || 0) }));
        res.json({
            success: true,
            data: {
                totalPlaytime: Math.round(totalPlaytime),
                averageSessionLength: Math.round(averageSessionLength),
                favoriteMood,
                moodDistribution: moodMap,
                topGames,
                dataPoints: games.length + sessions.length,
                lastUpdated: new Date()
            }
        });
    }
    catch (error) {
        console.error('❌ Analytics Error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});
exports.default = router;
//# sourceMappingURL=analytics.js.map