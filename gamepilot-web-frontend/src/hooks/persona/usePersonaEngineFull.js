"use strict";
// GamePilot Enhanced Persona Engine - Full Hook (Simplified)
// Combined hook for most common persona engine use cases
// Provides safe access to both legacy and enhanced features
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePersonaEngineFull = usePersonaEngineFull;
const react_1 = require("react");
// ============================================================================
// MAIN HOOK
// ============================================================================
/**
 * Combined hook for most common persona engine use cases
 * Provides snapshot, session tracking, and feature detection
 * Safe integration with both legacy and enhanced engines
 */
function usePersonaEngineFull(input, options) {
    const [snapshot, setSnapshot] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [_activeSessionId, _setActiveSessionId] = (0, react_1.useState)(null);
    const [_isTracking, _setIsTracking] = (0, react_1.useState)(false);
    // Enhanced engine status (currently disabled)
    const isEnhanced = false;
    const engineStatus = {
        enhanced: false,
        engine: 'legacy',
        features: {
            temporalPatterns: false,
            sessionTracking: false,
            compoundMoods: false,
            feedbackLoop: false
        }
    };
    // Build snapshot data (using legacy engine)
    const buildSnapshotData = (0, react_1.useCallback)(async () => {
        if (!input)
            return;
        setIsLoading(true);
        setError(null);
        try {
            // For now, just return the input as mock snapshot
            // This would normally call buildPersonaSnapshotSafe(input)
            const result = { input, timestamp: new Date() };
            setSnapshot(result);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to build persona snapshot');
            console.error('Persona snapshot error:', err);
        }
        finally {
            setIsLoading(false);
        }
    }, [input]);
    // Initial build
    (0, react_1.useEffect)(() => {
        if (input) {
            buildSnapshotData();
        }
    }, [input, buildSnapshotData]);
    // Auto-refresh if enabled
    (0, react_1.useEffect)(() => {
        if (!options?.autoRefreshSnapshot)
            return;
        const interval = setInterval(buildSnapshotData, options?.snapshotRefreshInterval || 60000);
        return () => clearInterval(interval);
    }, [options?.autoRefreshSnapshot, options?.snapshotRefreshInterval, buildSnapshotData]);
    // Safe wrapper functions (no-op for now)
    const recordMood = (0, react_1.useCallback)((moodId, intensity, moodTags, context, gameId) => {
        // No-op for now - would call recordMoodEventSafe
        console.log('Record mood:', { moodId, intensity, moodTags, context, gameId });
    }, []);
    const startSession = (0, react_1.useCallback)((gameId, preMood) => {
        // No-op for now - would call startSessionSafe
        console.log('Start session:', { gameId, preMood });
        return null;
    }, []);
    const endSession = (0, react_1.useCallback)((postMood) => {
        // No-op for now - would call endSessionSafe
        console.log('End session:', { postMood });
        return null;
    }, []);
    const getSessionHistory = (0, react_1.useCallback)(() => {
        // No-op for now - would return actual session history
        return [];
    }, []);
    // Extract enhanced insights (null for now)
    const enhancedInsights = null;
    return {
        // Core persona engine
        buildSnapshot: buildSnapshotData,
        recordMood,
        // Snapshot data
        snapshot,
        isSnapshotLoading: isLoading,
        snapshotError: error,
        enhancedInsights,
        refreshSnapshot: buildSnapshotData,
        // Session tracking
        activeSessionId: _activeSessionId,
        isTracking: _isTracking,
        startSession,
        endSession,
        getSessionHistory,
        // Feature detection
        isEnhanced,
        engineStatus,
        features: engineStatus.features
    };
}
exports.default = usePersonaEngineFull;
