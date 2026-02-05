"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMilestoneStats = exports.clearMilestones = exports.saveUnlockedMilestones = exports.getUnlockedMilestones = exports.getMilestoneColor = exports.getMilestoneIcon = exports.detectNewMilestones = exports.evaluateMilestones = exports.MilestoneType = void 0;
// Milestone types
var MilestoneType;
(function (MilestoneType) {
    // Mood Milestones
    MilestoneType["CHILL_MASTER"] = "chill_master";
    MilestoneType["CREATIVE_SHIFT"] = "creative_shift";
    MilestoneType["MOOD_EVOLUTION"] = "mood_evolution";
    MilestoneType["BALANCED_MOODS"] = "balanced_moods";
    MilestoneType["INTENSE_GAMER"] = "intense_gamer";
    // Session Length Milestones
    MilestoneType["QUICK_BURST_PLAYER"] = "quick_burst_player";
    MilestoneType["IMMERSION_ERA"] = "immersion_era";
    MilestoneType["BALANCED_SESSIONS"] = "balanced_sessions";
    MilestoneType["MARATHON_GAMER"] = "marathon_gamer";
    // Time-of-Day Milestones
    MilestoneType["NIGHT_OWL"] = "night_owl";
    MilestoneType["MORNING_WARRIOR"] = "morning_warrior";
    MilestoneType["AFTERNOON_ENTHUSIAST"] = "afternoon_enthusiast";
    MilestoneType["WEEKEND_WARRIOR"] = "weekend_warrior";
    // Play Pattern Milestones
    MilestoneType["COMPLETIONIST_LEVEL_UP"] = "completionist_level_up";
    MilestoneType["EXPLORER_BADGE"] = "explorer_badge";
    MilestoneType["STRATEGIST_MIND"] = "strategist_mind";
    MilestoneType["SOCIAL_BUTTERFLY"] = "social_butterfly";
    MilestoneType["COMPETITIVE_SPIRIT"] = "competitive_spirit";
    // Meta Milestones
    MilestoneType["IDENTITY_JOURNEY_BEGINS"] = "identity_journey_begins";
    MilestoneType["CONSISTENCY_BADGE"] = "consistency_badge";
    MilestoneType["HISTORIAN"] = "historian";
    MilestoneType["LEGENDARY_GAMER"] = "legendary_gamer";
    MilestoneType["IDENTITY_MASTER"] = "identity_master";
    // Achievement Milestones
    MilestoneType["COMPLETION_RATE_70"] = "completion_rate_70";
    MilestoneType["COMPLETION_RATE_80"] = "completion_rate_80";
    MilestoneType["COMPLETION_RATE_90"] = "completion_rate_90";
    MilestoneType["SOCIAL_RATIO_50"] = "social_ratio_50";
    MilestoneType["SOCIAL_RATIO_75"] = "social_ratio_75";
})(MilestoneType || (exports.MilestoneType = MilestoneType = {}));
// Milestone configurations
const milestoneConfigs = {
    // Mood Milestones
    [MilestoneType.CHILL_MASTER]: {
        title: 'Chill Master',
        description: 'Chill mood dominant in 5+ snapshots',
        icon: '😌',
        color: '#60a5fa',
        category: 'mood',
        requirements: (history) => history.filter(s => s.dominantMoods.includes('chill')).length >= 5
    },
    [MilestoneType.CREATIVE_SHIFT]: {
        title: 'Creative Shift',
        description: 'Creative becomes new dominant mood',
        icon: '🎨',
        color: '#a78bfa',
        category: 'mood',
        requirements: (history) => {
            if (history.length < 2)
                return false;
            const recent = history.slice(0, 2);
            const older = history.slice(2);
            return recent[0].dominantMoods.includes('creative') &&
                older.length > 0 &&
                !older[0].dominantMoods.includes('creative');
        }
    },
    [MilestoneType.MOOD_EVOLUTION]: {
        title: 'Mood Evolution',
        description: 'Dominant mood changes after 30+ days',
        icon: '🔄',
        color: '#f59e0b',
        category: 'mood',
        requirements: (history) => {
            if (history.length < 2)
                return false;
            const latest = history[0];
            const oldest = history[history.length - 1];
            const daysDiff = (new Date(latest.timestamp).getTime() - new Date(oldest.timestamp).getTime()) / (1000 * 60 * 60 * 24);
            return daysDiff >= 30 && latest.dominantMoods[0] !== oldest.dominantMoods[0];
        }
    },
    [MilestoneType.BALANCED_MOODS]: {
        title: 'Balanced Moods',
        description: '3+ different dominant moods across history',
        icon: '⚖️',
        color: '#10b981',
        category: 'mood',
        requirements: (history) => {
            const allMoods = new Set(history.flatMap(s => s.dominantMoods));
            return allMoods.size >= 3;
        }
    },
    [MilestoneType.INTENSE_GAMER]: {
        title: 'Intense Gamer',
        description: 'Intense mood dominant in 3+ snapshots',
        icon: '🔥',
        color: '#ef4444',
        category: 'mood',
        requirements: (history) => history.filter(s => s.dominantMoods.includes('intense')).length >= 3
    },
    // Session Length Milestones
    [MilestoneType.QUICK_BURST_PLAYER]: {
        title: 'Quick Burst Player',
        description: 'Short sessions dominate for 3 snapshots',
        icon: '⚡',
        color: '#fbbf24',
        category: 'session',
        requirements: (history) => history.filter(s => s.preferredSessionLength === 'short').length >= 3
    },
    [MilestoneType.IMMERSION_ERA]: {
        title: 'Immersion Era',
        description: 'Long sessions dominate for 3 snapshots',
        icon: '⏳',
        color: '#8b5cf6',
        category: 'session',
        requirements: (history) => history.filter(s => s.preferredSessionLength === 'long').length >= 3
    },
    [MilestoneType.BALANCED_SESSIONS]: {
        title: 'Balanced Sessions',
        description: 'Medium sessions in 5+ snapshots',
        icon: '⏰',
        color: '#06b6d4',
        category: 'session',
        requirements: (history) => history.filter(s => s.preferredSessionLength === 'medium').length >= 5
    },
    [MilestoneType.MARATHON_GAMER]: {
        title: 'Marathon Gamer',
        description: 'Average session > 120 minutes',
        icon: '🏃',
        color: '#dc2626',
        category: 'session',
        requirements: (history) => {
            const avgSession = history.reduce((sum, s) => sum + s.averageSessionLengthMinutes, 0) / history.length;
            return avgSession > 120;
        }
    },
    // Time-of-Day Milestones
    [MilestoneType.NIGHT_OWL]: {
        title: 'Night Owl',
        description: 'Late-night > 50% for 3 snapshots',
        icon: '🌙',
        color: '#6366f1',
        category: 'time',
        requirements: (history) => history.filter(s => s.preferredTimesOfDay.filter(t => t === 'late-night').length > 0).length >= 3
    },
    [MilestoneType.MORNING_WARRIOR]: {
        title: 'Morning Warrior',
        description: 'Morning > 50% for 3 snapshots',
        icon: '🌅',
        color: '#f59e0b',
        category: 'time',
        requirements: (history) => history.filter(s => s.preferredTimesOfDay.filter(t => t === 'morning').length > 0).length >= 3
    },
    [MilestoneType.AFTERNOON_ENTHUSIAST]: {
        title: 'Afternoon Enthusiast',
        description: 'Afternoon > 50% for 3 snapshots',
        icon: '☀️',
        color: '#fbbf24',
        category: 'time',
        requirements: (history) => history.filter(s => s.preferredTimesOfDay.filter(t => t === 'afternoon').length > 0).length >= 3
    },
    [MilestoneType.WEEKEND_WARRIOR]: {
        title: 'Weekend Warrior',
        description: 'Weekend gaming pattern detected',
        icon: '🎮',
        color: '#10b981',
        category: 'time',
        requirements: (history) => {
            // Check if weekend pattern emerges (simplified)
            return history.length >= 3;
        }
    },
    // Play Pattern Milestones
    [MilestoneType.COMPLETIONIST_LEVEL_UP]: {
        title: 'Completionist Level Up',
        description: 'Completion rate crosses threshold',
        icon: '🏆',
        color: '#f59e0b',
        category: 'pattern',
        requirements: (history) => {
            if (!history || history.length === 0)
                return 0;
            const latest = history[0];
            return latest?.completionRate || 0;
        }
    },
    [MilestoneType.EXPLORER_BADGE]: {
        title: 'Explorer Badge',
        description: 'Explorer pattern in 3+ snapshots',
        icon: '🗺️',
        color: '#10b981',
        category: 'pattern',
        requirements: (history) => history.filter(s => s.recentPlayPatterns.includes('explorer')).length >= 3
    },
    [MilestoneType.STRATEGIST_MIND]: {
        title: 'Strategist Mind',
        description: 'Strategist pattern in 3+ snapshots',
        icon: '♟️',
        color: '#6366f1',
        category: 'pattern',
        requirements: (history) => history.filter(s => s.recentPlayPatterns.includes('strategist')).length >= 3
    },
    [MilestoneType.SOCIAL_BUTTERFLY]: {
        title: 'Social Butterfly',
        description: 'Social pattern emerges',
        icon: '👥',
        color: '#ec4899',
        category: 'pattern',
        requirements: (history) => history.filter(s => s.recentPlayPatterns.includes('social')).length >= 2
    },
    [MilestoneType.COMPETITIVE_SPIRIT]: {
        title: 'Competitive Spirit',
        description: 'Competitive pattern in 3+ snapshots',
        icon: '⚔️',
        color: '#ef4444',
        category: 'pattern',
        requirements: (history) => history.filter(s => s.recentPlayPatterns.includes('competitive')).length >= 3
    },
    // Meta Milestones
    [MilestoneType.IDENTITY_JOURNEY_BEGINS]: {
        title: 'Identity Journey Begins',
        description: 'First snapshot created',
        icon: '🎯',
        color: '#8b5cf6',
        category: 'meta',
        requirements: (history) => history.length >= 1
    },
    [MilestoneType.CONSISTENCY_BADGE]: {
        title: 'Consistency Badge',
        description: '5 snapshots created',
        icon: '📅',
        color: '#06b6d4',
        category: 'meta',
        requirements: (history) => history.length >= 5
    },
    [MilestoneType.HISTORIAN]: {
        title: 'Historian',
        description: '10 snapshots created',
        icon: '📚',
        color: '#7c3aed',
        category: 'meta',
        requirements: (history) => history.length >= 10
    },
    [MilestoneType.LEGENDARY_GAMER]: {
        title: 'Legendary Gamer',
        description: '15 snapshots created',
        icon: '👑',
        color: '#dc2626',
        category: 'meta',
        requirements: (history) => history.length >= 15
    },
    [MilestoneType.IDENTITY_MASTER]: {
        title: 'Identity Master',
        description: '20 snapshots created (max)',
        icon: '🌟',
        color: '#fbbf24',
        category: 'meta',
        requirements: (history) => history.length >= 20
    },
    // Achievement Milestones
    [MilestoneType.COMPLETION_RATE_70]: {
        title: '70% Completion Rate',
        description: 'Achieved 70% game completion rate',
        icon: '🎖️',
        color: '#10b981',
        category: 'achievement',
        requirements: (history) => history[0]?.completionRate >= 0.7 ? 70 : 0
    },
    [MilestoneType.COMPLETION_RATE_80]: {
        title: '80% Completion Rate',
        description: 'Achieved 80% game completion rate',
        icon: '🏅',
        color: '#f59e0b',
        category: 'achievement',
        requirements: (history) => history[0]?.completionRate >= 0.8 ? 80 : 0
    },
    [MilestoneType.COMPLETION_RATE_90]: {
        title: '90% Completion Rate',
        description: 'Achieved 90% game completion rate',
        icon: '💎',
        color: '#8b5cf6',
        category: 'achievement',
        requirements: (history) => history[0]?.completionRate >= 0.9 ? 90 : 0
    },
    [MilestoneType.SOCIAL_RATIO_50]: {
        title: 'Social Butterfly',
        description: '50% multiplayer gaming',
        icon: '👥',
        color: '#ec4899',
        category: 'achievement',
        requirements: (history) => history[0]?.multiplayerRatio >= 0.5 ? 50 : 0
    },
    [MilestoneType.SOCIAL_RATIO_75]: {
        title: 'Community Leader',
        description: '75% multiplayer gaming',
        icon: '🌐',
        color: '#06b6d4',
        category: 'achievement',
        requirements: (history) => history[0]?.multiplayerRatio >= 0.75 ? 75 : 0
    }
};
/**
 * Evaluate all milestones for a given history
 */
const evaluateMilestones = (history) => {
    const unlocked = [];
    const progress = {};
    const nextMilestones = [];
    // Get existing unlocked milestones
    const existingMilestones = (0, exports.getUnlockedMilestones)();
    const unlockedIds = new Set(existingMilestones.map(m => m.id));
    // Evaluate each milestone
    Object.entries(milestoneConfigs).forEach(([type, config]) => {
        const result = config.requirements(history);
        if (typeof result === 'boolean') {
            if (result && !unlockedIds.has(type)) {
                // Milestone unlocked
                unlocked.push({
                    id: type,
                    type: type,
                    title: config.title,
                    description: config.description,
                    icon: config.icon,
                    color: config.color,
                    timestamp: new Date().toISOString(),
                    category: config.category
                });
            }
            else if (!result) {
                // Calculate progress for boolean milestones
                progress[type] = calculateProgress(type, history);
                if (progress[type] > 0) {
                    nextMilestones.push({
                        id: type,
                        type: type,
                        title: config.title,
                        description: config.description,
                        icon: config.icon,
                        color: config.color,
                        timestamp: '',
                        category: config.category
                    });
                }
            }
        }
        else if (typeof result === 'number') {
            // Numeric milestone (completion rate, etc.)
            const threshold = getThreshold(type);
            if (result >= threshold && !unlockedIds.has(type)) {
                unlocked.push({
                    id: type,
                    type: type,
                    title: config.title,
                    description: config.description,
                    icon: config.icon,
                    color: config.color,
                    timestamp: new Date().toISOString(),
                    value: result,
                    category: config.category
                });
            }
            else {
                progress[type] = Math.min(100, (result / threshold) * 100);
                if (progress[type] > 0) {
                    nextMilestones.push({
                        id: type,
                        type: type,
                        title: config.title,
                        description: config.description,
                        icon: config.icon,
                        color: config.color,
                        timestamp: '',
                        value: result,
                        category: config.category
                    });
                }
            }
        }
    });
    return {
        unlocked: unlocked.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        progress,
        nextMilestones: nextMilestones.sort((a, b) => (b.value || 0) - (a.value || 0))
    };
};
exports.evaluateMilestones = evaluateMilestones;
/**
 * Detect new milestones when a new snapshot is added
 */
const detectNewMilestones = (previousHistory, newSnapshot) => {
    const newHistory = [newSnapshot, ...previousHistory];
    const evaluation = (0, exports.evaluateMilestones)(newHistory);
    const previousEvaluation = (0, exports.evaluateMilestones)(previousHistory);
    const previousIds = new Set(previousEvaluation.unlocked.map(m => m.id));
    const newIds = new Set(evaluation.unlocked.map(m => m.id));
    // Find newly unlocked milestones
    const newMilestones = evaluation.unlocked.filter(m => !previousIds.has(m.id));
    // Save new milestones
    if (newMilestones.length > 0) {
        (0, exports.saveUnlockedMilestones)([...(0, exports.getUnlockedMilestones)(), ...newMilestones]);
    }
    return newMilestones;
};
exports.detectNewMilestones = detectNewMilestones;
/**
 * Get milestone icon for display
 */
const getMilestoneIcon = (type) => {
    return milestoneConfigs[type]?.icon || '🎯';
};
exports.getMilestoneIcon = getMilestoneIcon;
/**
 * Get milestone color for display
 */
const getMilestoneColor = (type) => {
    return milestoneConfigs[type]?.color || '#8b5cf6';
};
exports.getMilestoneColor = getMilestoneColor;
/**
 * Calculate progress toward a milestone
 */
const calculateProgress = (type, history) => {
    const config = milestoneConfigs[type];
    if (!config)
        return 0;
    switch (type) {
        case MilestoneType.CHILL_MASTER:
            return Math.min(100, (history.filter(s => s.dominantMoods.includes('chill')).length / 5) * 100);
        case MilestoneType.CONSISTENCY_BADGE:
            return Math.min(100, (history.length / 5) * 100);
        case MilestoneType.HISTORIAN:
            return Math.min(100, (history.length / 10) * 100);
        case MilestoneType.LEGENDARY_GAMER:
            return Math.min(100, (history.length / 15) * 100);
        case MilestoneType.IDENTITY_MASTER:
            return Math.min(100, (history.length / 20) * 100);
        case MilestoneType.QUICK_BURST_PLAYER:
            return Math.min(100, (history.filter(s => s.preferredSessionLength === 'short').length / 3) * 100);
        case MilestoneType.IMMERSION_ERA:
            return Math.min(100, (history.filter(s => s.preferredSessionLength === 'long').length / 3) * 100);
        case MilestoneType.BALANCED_SESSIONS:
            return Math.min(100, (history.filter(s => s.preferredSessionLength === 'medium').length / 5) * 100);
        case MilestoneType.EXPLORER_BADGE:
            return Math.min(100, (history.filter(s => s.recentPlayPatterns.includes('explorer')).length / 3) * 100);
        case MilestoneType.STRATEGIST_MIND:
            return Math.min(100, (history.filter(s => s.recentPlayPatterns.includes('strategist')).length / 3) * 100);
        case MilestoneType.COMPETITIVE_SPIRIT:
            return Math.min(100, (history.filter(s => s.recentPlayPatterns.includes('competitive')).length / 3) * 100);
        case MilestoneType.NIGHT_OWL:
            return Math.min(100, (history.filter(s => s.preferredTimesOfDay.filter(t => t === 'late-night').length > 0).length / 3) * 100);
        case MilestoneType.MORNING_WARRIOR:
            return Math.min(100, (history.filter(s => s.preferredTimesOfDay.filter(t => t === 'morning').length > 0).length / 3) * 100);
        case MilestoneType.AFTERNOON_ENTHUSIAST:
            return Math.min(100, (history.filter(s => s.preferredTimesOfDay.filter(t => t === 'afternoon').length > 0).length / 3) * 100);
        default:
            return 0;
    }
};
/**
 * Get threshold for numeric milestones
 */
const getThreshold = (type) => {
    switch (type) {
        case MilestoneType.COMPLETION_RATE_70:
            return 70;
        case MilestoneType.COMPLETION_RATE_80:
            return 80;
        case MilestoneType.COMPLETION_RATE_90:
            return 90;
        case MilestoneType.SOCIAL_RATIO_50:
            return 50;
        case MilestoneType.SOCIAL_RATIO_75:
            return 75;
        default:
            return 0;
    }
};
/**
 * Get unlocked milestones from localStorage
 */
const getUnlockedMilestones = () => {
    try {
        const stored = localStorage.getItem('identity_milestones');
        return stored ? JSON.parse(stored) : [];
    }
    catch (error) {
        console.warn('Failed to load milestones:', error);
        return [];
    }
};
exports.getUnlockedMilestones = getUnlockedMilestones;
/**
 * Save unlocked milestones to localStorage
 */
const saveUnlockedMilestones = (milestones) => {
    try {
        localStorage.setItem('identity_milestones', JSON.stringify(milestones));
        // Dispatch event for real-time updates
        window.dispatchEvent(new CustomEvent('milestones-updated', {
            detail: { milestones }
        }));
    }
    catch (error) {
        console.warn('Failed to save milestones:', error);
    }
};
exports.saveUnlockedMilestones = saveUnlockedMilestones;
/**
 * Clear all milestones
 */
const clearMilestones = () => {
    try {
        localStorage.removeItem('identity_milestones');
        // Dispatch event for real-time updates
        window.dispatchEvent(new CustomEvent('milestones-cleared'));
    }
    catch (error) {
        console.warn('Failed to clear milestones:', error);
    }
};
exports.clearMilestones = clearMilestones;
/**
 * Get milestone statistics
 */
const getMilestoneStats = () => {
    const milestones = (0, exports.getUnlockedMilestones)();
    const byCategory = {};
    milestones.forEach(milestone => {
        byCategory[milestone.category] = (byCategory[milestone.category] || 0) + 1;
    });
    const recentUnlocks = milestones
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);
    return {
        totalUnlocked: milestones.length,
        byCategory,
        recentUnlocks
    };
};
exports.getMilestoneStats = getMilestoneStats;
