"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HybridArchetypeCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const usePersonaSnapshot_1 = require("../../../hooks/persona/usePersonaSnapshot");
const HybridArchetypeCard = ({ theme }) => {
    const personaSnapshot = (0, usePersonaSnapshot_1.usePersonaSnapshot)();
    const inferSecondaryArchetype = (traits) => {
        const { intensity, pacing, socialStyle, riskProfile } = traits;
        // Logic to infer secondary archetype based on trait combinations
        if (socialStyle === 'Coop' && intensity === 'High')
            return 'Socializer';
        if (riskProfile === 'Experimental' && pacing === 'Flow')
            return 'Explorer';
        if (intensity === 'High' && pacing === 'Burst')
            return 'Competitor';
        if (pacing === 'Marathon' && socialStyle === 'Solo')
            return 'Immersive';
        if (riskProfile === 'Balanced' && intensity === 'Medium')
            return 'Strategist';
        if (socialStyle === 'Solo' && intensity === 'Low')
            return 'Casual';
        // Default fallback based on dominant trait
        if (intensity === 'High')
            return 'Achiever';
        if (socialStyle !== 'Solo')
            return 'Socializer';
        if (riskProfile === 'Experimental')
            return 'Explorer';
        return 'Strategist';
    };
    const getHybridIdentity = (primary, secondary) => {
        const hybrids = {
            'Achiever-Socializer': {
                name: 'The Leader',
                symbol: '👑',
                description: 'You drive others toward success while achieving your own goals. Your competitive spirit inspires teams to victory.'
            },
            'Achiever-Strategist': {
                name: 'The Tactician',
                symbol: '♟️',
                description: 'You combine goal-driven ambition with brilliant planning. Every achievement is a calculated step toward mastery.'
            },
            'Achiever-Explorer': {
                name: 'The Pioneer',
                symbol: '🏔️',
                description: 'You conquer new territories while collecting achievements. Your drive pushes boundaries and discovers new paths.'
            },
            'Explorer-Immersive': {
                name: 'The Wanderer',
                symbol: '🌌',
                description: 'You lose yourself in vast worlds, discovering every secret while becoming one with the adventure.'
            },
            'Explorer-Socializer': {
                name: 'The Guide',
                symbol: '🧭',
                description: 'You lead others through new experiences, sharing discoveries and building communities around exploration.'
            },
            'Socializer-Achiever': {
                name: 'The Champion',
                symbol: '🏆',
                description: 'You rally teams to victory while celebrating every win. Your success is measured by the group\'s achievements.'
            },
            'Strategist-Immersive': {
                name: 'The Architect',
                symbol: '🏛️',
                description: 'You design complex worlds and master their systems. Every detail is part of your grand vision.'
            },
            'Immersive-Explorer': {
                name: 'The Seeker',
                symbol: '🔍',
                description: 'You dive deep into worlds, uncovering their deepest secrets and becoming part of their stories.'
            },
            'Competitor-Strategist': {
                name: 'The Commander',
                symbol: '⚔️',
                description: 'You outthink opponents while dominating the battlefield. Strategy and skill make you unstoppable.'
            },
            'Casual-Explorer': {
                name: 'The Wanderer',
                symbol: '🍃',
                description: 'You explore at your own pace, enjoying the journey without pressure. Every discovery is a pleasant surprise.'
            }
        };
        const key = `${primary}-${secondary}`;
        const reverseKey = `${secondary}-${primary}`;
        return hybrids[key] || hybrids[reverseKey] || hybrids['Achiever-Strategist'];
    };
    if (!personaSnapshot) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-xl p-6 border border-white/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center text-gray-400", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl mb-2", children: "\uD83C\uDF1F" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: "Loading hybrid identity..." })] }) }));
    }
    const primaryArchetype = personaSnapshot.traits.archetypeId;
    const secondaryArchetype = inferSecondaryArchetype(personaSnapshot.traits);
    const hybridIdentity = getHybridIdentity(primaryArchetype, secondaryArchetype);
    return ((0, jsx_runtime_1.jsx)("div", { className: `glass-morphism rounded-xl p-6 border border-white/10 hover:bg-white/5 transition-all duration-300 cursor-pointer`, children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center mb-4", children: (0, jsx_runtime_1.jsx)("div", { className: "text-5xl mb-2", children: hybridIdentity.symbol }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-white mb-2", children: hybridIdentity.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center gap-2 mb-3", children: [(0, jsx_runtime_1.jsx)("span", { className: `px-2 py-1 rounded-full text-xs ${theme.bg} ${theme.accent} border border-white/20`, children: primaryArchetype }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "+" }), (0, jsx_runtime_1.jsx)("span", { className: `px-2 py-1 rounded-full text-xs ${theme.bg} ${theme.accent} border border-white/20`, children: secondaryArchetype })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-300 leading-relaxed", children: hybridIdentity.description }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 pt-4 border-t border-white/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-400", children: [(0, jsx_runtime_1.jsxs)("span", { className: "block mb-1", children: ["Primary: ", primaryArchetype] }), (0, jsx_runtime_1.jsxs)("span", { className: "block", children: ["Secondary: ", secondaryArchetype] })] }) })] }) }));
};
exports.HybridArchetypeCard = HybridArchetypeCard;
