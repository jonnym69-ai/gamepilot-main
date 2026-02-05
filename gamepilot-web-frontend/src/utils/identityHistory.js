"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importIdentityHistory = exports.exportIdentityHistory = exports.getIdentityHistoryStats = exports.shouldCreateSnapshot = exports.createIdentitySnapshot = exports.getIdentitySnapshot = exports.deleteIdentitySnapshot = exports.clearIdentityHistory = exports.getIdentityHistory = exports.saveIdentitySnapshot = void 0;
/**
 * Save an identity snapshot to localStorage
 */
const saveIdentitySnapshot = (snapshot, options = {}) => {
    const { maxSnapshots = 20, storageKey = 'identity_history' } = options;
    try {
        // Get existing history
        const existingHistory = (0, exports.getIdentityHistory)(options);
        // Create new snapshot with ID
        const newSnapshot = {
            ...snapshot,
            id: generateSnapshotId()
        };
        // Add new snapshot to beginning of array
        const updatedHistory = [newSnapshot, ...existingHistory];
        // Keep only the most recent snapshots
        const trimmedHistory = updatedHistory.slice(0, maxSnapshots);
        // Save to localStorage
        localStorage.setItem(storageKey, JSON.stringify(trimmedHistory));
        // Dispatch custom event for real-time updates
        window.dispatchEvent(new CustomEvent('identity-history-updated', {
            detail: { snapshot: newSnapshot, history: trimmedHistory }
        }));
    }
    catch (error) {
        console.warn('Failed to save identity snapshot:', error);
    }
};
exports.saveIdentitySnapshot = saveIdentitySnapshot;
/**
 * Get all identity snapshots from localStorage
 */
const getIdentityHistory = (options = {}) => {
    const { storageKey = 'identity_history' } = options;
    try {
        const stored = localStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : [];
    }
    catch (error) {
        console.warn('Failed to load identity history:', error);
        return [];
    }
};
exports.getIdentityHistory = getIdentityHistory;
/**
 * Clear all identity snapshots
 */
const clearIdentityHistory = (options = {}) => {
    const { storageKey = 'identity_history' } = options;
    try {
        localStorage.removeItem(storageKey);
        // Dispatch event for real-time updates
        window.dispatchEvent(new CustomEvent('identity-history-cleared'));
    }
    catch (error) {
        console.warn('Failed to clear identity history:', error);
    }
};
exports.clearIdentityHistory = clearIdentityHistory;
/**
 * Delete a specific snapshot by ID
 */
const deleteIdentitySnapshot = (snapshotId, options = {}) => {
    const { storageKey = 'identity_history' } = options;
    try {
        const existingHistory = (0, exports.getIdentityHistory)(options);
        const filteredHistory = existingHistory.filter(snapshot => snapshot.id !== snapshotId);
        if (filteredHistory.length !== existingHistory.length) {
            localStorage.setItem(storageKey, JSON.stringify(filteredHistory));
            // Dispatch event for real-time updates
            window.dispatchEvent(new CustomEvent('identity-history-deleted', {
                detail: { snapshotId, history: filteredHistory }
            }));
            return true;
        }
        return false;
    }
    catch (error) {
        console.warn('Failed to delete identity snapshot:', error);
        return false;
    }
};
exports.deleteIdentitySnapshot = deleteIdentitySnapshot;
/**
 * Get a specific snapshot by ID
 */
const getIdentitySnapshot = (snapshotId, options = {}) => {
    const history = (0, exports.getIdentityHistory)(options);
    return history.find(snapshot => snapshot.id === snapshotId) || null;
};
exports.getIdentitySnapshot = getIdentitySnapshot;
/**
 * Generate a unique snapshot ID
 */
const generateSnapshotId = () => {
    return `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
/**
 * Create a snapshot from persona context and related data
 */
const createIdentitySnapshot = (personaContext, identityDefiningGames, shortNarrative, fullNarrative) => {
    const topGames = identityDefiningGames.slice(0, 5).map(match => ({
        id: match.game.id,
        title: match.game.title,
        score: match.score
    }));
    return {
        timestamp: new Date().toISOString(),
        dominantMoods: personaContext.dominantMoods || [],
        preferredSessionLength: personaContext.preferredSessionLength || 'medium',
        preferredTimesOfDay: personaContext.preferredTimesOfDay || [],
        recentPlayPatterns: personaContext.recentPlayPatterns || [],
        completionRate: personaContext.completionRate || 0,
        multiplayerRatio: personaContext.multiplayerRatio || 0,
        averageSessionLengthMinutes: personaContext.averageSessionLengthMinutes || 0,
        topIdentityGames: topGames,
        shortNarrative,
        fullNarrative
    };
};
exports.createIdentitySnapshot = createIdentitySnapshot;
/**
 * Check if a new snapshot should be created based on time criteria
 */
const shouldCreateSnapshot = (lastSnapshotTime) => {
    if (!lastSnapshotTime)
        return true;
    const lastSnapshot = new Date(lastSnapshotTime);
    const now = new Date();
    const daysDiff = (now.getTime() - lastSnapshot.getTime()) / (1000 * 60 * 60 * 24);
    // Create snapshot if it's been more than 7 days
    return daysDiff >= 7;
};
exports.shouldCreateSnapshot = shouldCreateSnapshot;
/**
 * Get snapshot statistics
 */
const getIdentityHistoryStats = (options = {}) => {
    const history = (0, exports.getIdentityHistory)(options);
    if (history.length === 0) {
        return {
            totalSnapshots: 0,
            oldestSnapshot: null,
            newestSnapshot: null,
            moodFrequency: {},
            sessionLengthFrequency: {},
            timeOfDayFrequency: {}
        };
    }
    const moodFrequency = {};
    const sessionLengthFrequency = {};
    const timeOfDayFrequency = {};
    // Calculate frequencies
    history.forEach(snapshot => {
        // Count moods
        snapshot.dominantMoods.forEach(mood => {
            moodFrequency[mood] = (moodFrequency[mood] || 0) + 1;
        });
        // Count session lengths
        sessionLengthFrequency[snapshot.preferredSessionLength] =
            (sessionLengthFrequency[snapshot.preferredSessionLength] || 0) + 1;
        // Count times of day
        snapshot.preferredTimesOfDay.forEach(time => {
            timeOfDayFrequency[time] = (timeOfDayFrequency[time] || 0) + 1;
        });
    });
    return {
        totalSnapshots: history.length,
        oldestSnapshot: history[history.length - 1]?.timestamp || null,
        newestSnapshot: history[0]?.timestamp || null,
        moodFrequency,
        sessionLengthFrequency,
        timeOfDayFrequency
    };
};
exports.getIdentityHistoryStats = getIdentityHistoryStats;
/**
 * Export identity history as JSON for backup
 */
const exportIdentityHistory = (options = {}) => {
    const history = (0, exports.getIdentityHistory)(options);
    return JSON.stringify(history, null, 2);
};
exports.exportIdentityHistory = exportIdentityHistory;
/**
 * Import identity history from JSON backup
 */
const importIdentityHistory = (jsonString, options = {}) => {
    try {
        const history = JSON.parse(jsonString);
        // Validate that it's an array of snapshots
        if (!Array.isArray(history)) {
            throw new Error('Invalid format: expected array of snapshots');
        }
        // Validate each snapshot
        const validHistory = history.filter(snapshot => {
            return snapshot.id &&
                snapshot.timestamp &&
                Array.isArray(snapshot.dominantMoods) &&
                typeof snapshot.preferredSessionLength === 'string' &&
                Array.isArray(snapshot.preferredTimesOfDay) &&
                typeof snapshot.shortNarrative === 'string';
        });
        if (validHistory.length !== history.length) {
            console.warn(`Filtered out ${history.length - validHistory.length} invalid snapshots`);
        }
        // Sort by timestamp (newest first)
        validHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        // Save to localStorage
        localStorage.setItem(options.storageKey || 'identity_history', JSON.stringify(validHistory));
        // Dispatch event for real-time updates
        window.dispatchEvent(new CustomEvent('identity-history-imported', {
            detail: { history: validHistory }
        }));
        return true;
    }
    catch (error) {
        console.error('Failed to import identity history:', error);
        return false;
    }
};
exports.importIdentityHistory = importIdentityHistory;
