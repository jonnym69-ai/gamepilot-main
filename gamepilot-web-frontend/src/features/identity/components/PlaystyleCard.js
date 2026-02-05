"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaystyleCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const usePersonaSnapshot_1 = require("../../../hooks/persona/usePersonaSnapshot");
// Simple Card component to replace UI package dependency
const Card = ({ children, className = '' }) => ((0, jsx_runtime_1.jsx)("div", { className: `glass-morphism rounded-xl p-6 cursor-pointer hover:bg-white/15 transition-colors ${className}`, children: children }));
const PlaystyleCard = () => {
    const personaSnapshot = (0, usePersonaSnapshot_1.usePersonaSnapshot)();
    if (!personaSnapshot) {
        return ((0, jsx_runtime_1.jsx)(Card, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center text-gray-400", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl mb-2", children: "\uD83C\uDFAF" }), (0, jsx_runtime_1.jsx)("p", { children: "Loading playstyle data..." })] }) }));
    }
    const getArchetypeDescription = (archetypeId) => {
        switch (archetypeId) {
            case 'Achiever': return 'You thrive on completing challenges and earning rewards';
            case 'Explorer': return 'You love discovering new worlds and hidden secrets';
            case 'Socializer': return 'You enjoy playing with others and building communities';
            case 'Competitor': return 'You seek victory and excel in competitive gameplay';
            case 'Strategist': return 'You excel at planning and tactical decision-making';
            case 'Creative': return 'You enjoy building, creating, and expressing yourself';
            case 'Casual': return 'You prefer relaxed, stress-free gaming experiences';
            case 'Specialist': return 'You focus on mastering specific genres or games';
            default: return 'Your unique gaming style';
        }
    };
    const getArchetypeEmoji = (archetypeId) => {
        switch (archetypeId) {
            case 'Achiever': return '🏆';
            case 'Explorer': return '🗺️';
            case 'Socializer': return '👥';
            case 'Competitor': return '⚔️';
            case 'Strategist': return '♟️';
            case 'Creative': return '🎨';
            case 'Casual': return '😌';
            case 'Specialist': return '🎯';
            default: return '🎮';
        }
    };
    const getIntensityDescription = (intensity) => {
        switch (intensity) {
            case 'Low': return 'Prefers short, casual gaming sessions';
            case 'Medium': return 'Enjoys balanced gaming sessions';
            case 'High': return 'Thrives in intense, extended gameplay';
            default: return 'Moderate gaming approach';
        }
    };
    const getPacingDescription = (pacing) => {
        switch (pacing) {
            case 'Burst': return 'Short, intense gaming sessions';
            case 'Flow': return 'Moderate, steady gaming sessions';
            case 'Marathon': return 'Long, extended gaming sessions';
            default: return 'Balanced gaming pace';
        }
    };
    const getSocialStyleDescription = (socialStyle) => {
        switch (socialStyle) {
            case 'Solo': return 'Prefers single-player experiences';
            case 'Coop': return 'Enjoys cooperative multiplayer';
            case 'Competitive': return 'Thrives in competitive multiplayer';
            default: return 'Flexible social preferences';
        }
    };
    return ((0, jsx_runtime_1.jsx)(Card, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-4", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAF" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-white", children: "Playstyle Archetype" })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 bg-gradient-to-r from-gaming-primary to-gaming-secondary/20 rounded-lg border border-gaming-primary/30", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl mb-2", children: getArchetypeEmoji(personaSnapshot.traits.archetypeId) }), (0, jsx_runtime_1.jsx)("h4", { className: "text-xl font-bold text-white capitalize mb-2", children: personaSnapshot.traits.archetypeId }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-300", children: getArchetypeDescription(personaSnapshot.traits.archetypeId) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300", children: "Intensity" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent font-semibold", children: personaSnapshot.traits.intensity })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400", children: getIntensityDescription(personaSnapshot.traits.intensity) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300", children: "Pacing" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent font-semibold", children: personaSnapshot.traits.pacing })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400", children: getPacingDescription(personaSnapshot.traits.pacing) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-300", children: "Social Style" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gaming-accent font-semibold", children: personaSnapshot.traits.socialStyle })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400", children: getSocialStyleDescription(personaSnapshot.traits.socialStyle) })] })] })] }) }));
};
exports.PlaystyleCard = PlaystyleCard;
