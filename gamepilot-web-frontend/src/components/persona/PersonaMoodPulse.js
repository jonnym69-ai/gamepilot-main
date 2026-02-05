"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaMoodPulse = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Mood tone color mapping for visual indicators
 */
const MOOD_TONE_COLORS = {
    Calm: 'bg-blue-500',
    Hyped: 'bg-yellow-500',
    Competitive: 'bg-red-500',
    Reflective: 'bg-purple-500',
    Comfort: 'bg-green-500'
};
const SIZE_CLASSES = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
};
const PULSE_RING_SIZES = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
};
/**
 * Get tone color based on mood ID
 */
function getToneColor(moodId) {
    // Map mood IDs to tones
    const moodToTone = {
        'chill': 'Calm',
        'story': 'Calm',
        'creative': 'Calm',
        'energetic': 'Hyped',
        'social': 'Hyped',
        'exploratory': 'Hyped',
        'competitive': 'Competitive',
        'focused': 'Competitive',
        'nostalgic': 'Reflective',
        'melancholic': 'Reflective',
        'cozy': 'Comfort',
        'relaxed': 'Comfort'
    };
    const tone = moodToTone[moodId] || 'Comfort';
    return MOOD_TONE_COLORS[tone];
}
/**
 * PersonaMoodPulse - Animated mood indicator with pulse effect
 * Displays current mood as a colored dot with animated pulse ring
 */
const PersonaMoodPulse = ({ mood, size = 'md', className = '' }) => {
    const colorClass = mood ? getToneColor(mood.moodId) : 'bg-gray-400';
    const sizeClass = SIZE_CLASSES[size];
    const pulseSizeClass = PULSE_RING_SIZES[size];
    return ((0, jsx_runtime_1.jsxs)("div", { className: `relative ${className}`, children: [(0, jsx_runtime_1.jsx)("div", { className: `
          relative z-10
          ${colorClass}
          ${sizeClass}
          rounded-full
          shadow-md
          transition-colors duration-300
        `, title: mood ? `${mood.moodId} (Intensity: ${mood.intensity})` : 'No mood data' }), mood && mood.intensity >= 7 && ((0, jsx_runtime_1.jsx)("div", { className: `
            absolute top-0 right-0
            w-1.5 h-1.5
            bg-white
            rounded-full
          ` }))] }));
};
exports.PersonaMoodPulse = PersonaMoodPulse;
