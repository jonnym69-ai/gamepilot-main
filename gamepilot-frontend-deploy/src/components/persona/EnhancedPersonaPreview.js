"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedPersonaPreview = EnhancedPersonaPreview;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Maps mood to GamePilot color theme for glow effects
 * Returns tailwind color classes for mood-based styling
 */
function getMoodColor(mood) {
    const moodColors = {
        energetic: { ring: 'ring-amber-400/20', shadow: 'shadow-amber-400/10', glow: 'amber-400' },
        creative: { ring: 'ring-purple-400/20', shadow: 'shadow-purple-400/10', glow: 'purple-400' },
        focused: { ring: 'ring-blue-400/20', shadow: 'shadow-blue-400/10', glow: 'blue-400' },
        relaxed: { ring: 'ring-teal-400/20', shadow: 'shadow-teal-400/10', glow: 'teal-400' },
        competitive: { ring: 'ring-red-400/20', shadow: 'shadow-red-400/10', glow: 'red-400' },
        exploratory: { ring: 'ring-emerald-400/20', shadow: 'shadow-emerald-400/10', glow: 'emerald-400' },
        social: { ring: 'ring-pink-400/20', shadow: 'shadow-pink-400/10', glow: 'pink-400' }
    };
    return moodColors[mood?.toLowerCase()] || {
        ring: 'ring-white/10',
        shadow: 'shadow-white/5',
        glow: 'white'
    };
}
/**
 * Gets dominant mood from enhanced insights
 * Analyzes compound moods and session data to determine primary mood
 */
function getDominantMood(enhancedInsights) {
    // Check compound moods first
    if (enhancedInsights.compoundMoods?.length > 0) {
        return enhancedInsights.compoundMoods[0].primary;
    }
    // Check session insights for mood patterns
    if (enhancedInsights.sessionInsights?.averageMoodDelta > 0.5) {
        return 'energetic';
    }
    if (enhancedInsights.sessionInsights?.averageMoodDelta < -0.5) {
        return 'relaxed';
    }
    // Default to neutral
    return 'focused';
}
/**
 * Formats hour array for display
 * Converts [0, 1, 2] to "12am, 1am, 2am"
 */
function formatHours(hours) {
    if (!hours || hours.length === 0)
        return 'None';
    return hours
        .map(hour => {
        if (hour === 0)
            return '12am';
        if (hour === 12)
            return '12pm';
        if (hour < 12)
            return `${hour}am`;
        return `${hour - 12}pm`;
    })
        .slice(0, 3) // Show top 3 hours
        .join(', ');
}
/**
 * Formats mood delta for display
 * Converts number to "improved (+1.2)" or "declined (-0.8)"
 */
function formatMoodDelta(delta) {
    if (delta === 0)
        return 'neutral';
    if (delta > 0)
        return `improved (+${delta.toFixed(1)})`;
    return `declined (${delta.toFixed(1)})`;
}
/**
 * Gets day name from number
 * Converts 0-6 to "Sunday"-"Saturday"
 */
function getDayName(dayNumber) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber] || 'Unknown';
}
/**
 * Finds best day from day trends
 */
function getBestDay(dayTrends) {
    if (!dayTrends || Object.keys(dayTrends).length === 0)
        return null;
    let bestDay = '';
    let bestValue = -1;
    Object.entries(dayTrends).forEach(([day, value]) => {
        if (value > bestValue) {
            bestValue = value;
            bestDay = day;
        }
    });
    return { day: bestDay, value: bestValue };
}
// ============================================================================
// MAIN COMPONENT
// ============================================================================
/**
 * Enhanced Persona Preview Component
 * Displays enhanced persona insights in a minimal, non-intrusive way
 * Only renders if enhanced insights are available
 */
function EnhancedPersonaPreview({ enhancedInsights, className = '' }) {
    // Return null if no enhanced insights available
    if (!enhancedInsights) {
        return null;
    }
    const { temporalInsights, sessionInsights, compoundMoods } = enhancedInsights;
    // Return null if no data in any category
    const hasAnyData = ((temporalInsights && (temporalInsights.bestHours?.length > 0 || temporalInsights.dayTrends)) ||
        (sessionInsights && sessionInsights.averageMoodDelta !== undefined) ||
        (compoundMoods && compoundMoods.length > 0));
    if (!hasAnyData) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease: "easeOut" }, whileHover: { scale: 1.01, y: -2 }, className: `mt-2 p-3 rounded-xl bg-white/5 dark:bg-neutral-900/20
                      backdrop-blur-md border border-white/10 shadow-sm
                      transition-opacity duration-300 ${className}`, style: {
            ring: `1px ${getMoodColor(getDominantMood(enhancedInsights)).ring}`,
            boxShadow: `0 4px 6px -1px ${getMoodColor(getDominantMood(enhancedInsights)).shadow}`
        }, children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 1 }, animate: { opacity: [1, 0.9, 1] }, transition: {
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                }, className: "absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-semibold text-white/80 mb-3 relative z-10", children: "Enhanced Insights" }), temporalInsights && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 relative z-10", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs font-medium text-white/60 uppercase tracking-wider", children: "Temporal Patterns" }), temporalInsights.bestHours && temporalInsights.bestHours.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-white/60", children: "Best hours:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-white/90", children: formatHours(temporalInsights.bestHours) })] })), temporalInsights.dayTrends && Object.keys(temporalInsights.dayTrends).length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-white/60", children: "Best day:" }), (() => {
                                        const bestDay = getBestDay(temporalInsights.dayTrends);
                                        return bestDay ? ((0, jsx_runtime_1.jsx)("span", { className: "text-sm text-white/90", children: getDayName(Object.keys(temporalInsights.dayTrends).indexOf(bestDay.day)) })) : null;
                                    })()] }))] }), (sessionInsights || compoundMoods) && ((0, jsx_runtime_1.jsx)("div", { className: "h-px bg-white/10 my-2 relative z-10" }))] })), sessionInsights && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 relative z-10", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs font-medium text-white/60 uppercase tracking-wider", children: "Session Analysis" }), sessionInsights.averageMoodDelta !== undefined && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-white/60", children: "Last sessions:" }), (0, jsx_runtime_1.jsx)("span", { className: `text-sm font-medium ${sessionInsights.averageMoodDelta > 0 ? 'text-green-400' :
                                            sessionInsights.averageMoodDelta < 0 ? 'text-red-400' :
                                                'text-gray-400'}`, children: formatMoodDelta(sessionInsights.averageMoodDelta) })] })), sessionInsights.positiveSessionRatio !== undefined && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-white/60", children: "Positive sessions:" }), (0, jsx_runtime_1.jsxs)("span", { className: `text-sm font-medium ${sessionInsights.positiveSessionRatio > 0.7 ? 'text-green-400' :
                                            sessionInsights.positiveSessionRatio < 0.3 ? 'text-red-400' :
                                                'text-yellow-400'}`, children: [Math.round(sessionInsights.positiveSessionRatio * 100), "%"] })] }))] }), compoundMoods && ((0, jsx_runtime_1.jsx)("div", { className: "h-px bg-white/10 my-2 relative z-10" }))] })), compoundMoods && compoundMoods.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 relative z-10", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs font-medium text-white/60 uppercase tracking-wider", children: "Mood Patterns" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-white/60", children: "Frequent combo:" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-white/90", children: [compoundMoods[0].primary, " + ", compoundMoods[0].secondary] })] })] }))] }, enhancedInsights.timestamp?.getTime() || 'default'));
}
// ============================================================================
// DEFAULT EXPORT
// ============================================================================
exports.default = EnhancedPersonaPreview;
