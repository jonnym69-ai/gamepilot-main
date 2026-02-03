// GamePilot Persona Engine - Public API
// Clean re-exports for persona functionality (Legacy + Enhanced)
// Core persona snapshot API
export { buildPersonaSnapshot, createMinimalPersonaSnapshot, isHighConfidenceSnapshot, getSnapshotSummary } from './personaSnapshot';
// Trait extraction
export { derivePersonaTraits } from './traitExtractor';
// Mood integration
export { mapMoodToPersonaContext, createMoodState, isMoodRecent, getMoodIntensityCategory } from './personaMoodMapping';
// Narrative generation
export { buildPersonaNarrative, getNarrativeStyle } from './personaNarrative';
// Enhanced persona engine (safe integration)
export { 
// Safe integration layer
personaEngine, buildPersonaSnapshotSafe, recordMoodEventSafe, startSessionSafe, endSessionSafe, recordFeedbackSafe, getPersonaEngineStatus, isEnhancedPersonaSnapshot, getEnhancedInsights, migrateLegacyMoodData, ENABLE_ENHANCED_PERSONA } from './safePersonaIntegration';
// React hooks for enhanced features
export { usePersonaEngine, usePersonaSnapshot, useSessionTracking, useEnhancedPersonaDetection, usePersonaEngineFull } from './personaHooks';
// Enhanced persona engine (direct access - use with caution)
export { EnhancedPersonaEngine, createEnhancedPersonaEngine, DEFAULT_ENHANCED_CONFIG } from './enhancedPersonaIntegration';
export { 
// Recording functions
recordMoodEvent, recordSessionStart, recordSessionEnd, recordRecommendationFeedback, 
// Analysis functions
getTemporalMoodPatterns, getCompoundMoodSuggestions, getSessionMoodDelta, 
// Utility functions
moodEventToUserMoodEntry, userMoodEntryToMoodEvent, validateMoodEvent, 
// Migration helpers
migrateMoodHistory, demigrateMoodHistory } from './enhancedPersonaEngine';
