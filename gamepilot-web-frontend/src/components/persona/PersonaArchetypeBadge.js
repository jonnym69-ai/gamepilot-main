"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaArchetypeBadge = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Archetype metadata for styling and display
 */
const ARCHETYPE_METADATA = {
    Achiever: {
        name: 'Achiever',
        icon: '🏆',
        gradient: 'from-yellow-500 to-amber-600',
        description: 'Goal-oriented completionist'
    },
    Explorer: {
        name: 'Explorer',
        icon: '🗺️',
        gradient: 'from-green-500 to-emerald-600',
        description: 'Curious discoverer'
    },
    Socializer: {
        name: 'Socializer',
        icon: '👥',
        gradient: 'from-blue-500 to-cyan-600',
        description: 'Community player'
    },
    Competitor: {
        name: 'Competitor',
        icon: '⚔️',
        gradient: 'from-red-500 to-orange-600',
        description: 'Victory-driven'
    },
    Strategist: {
        name: 'Strategist',
        icon: '♟️',
        gradient: 'from-indigo-500 to-purple-600',
        description: 'Tactical thinker'
    },
    Creative: {
        name: 'Creative',
        icon: '🎨',
        gradient: 'from-purple-500 to-pink-600',
        description: 'Imaginative builder'
    },
    Casual: {
        name: 'Casual',
        icon: '😌',
        gradient: 'from-teal-500 to-cyan-600',
        description: 'Relaxed gamer'
    },
    Specialist: {
        name: 'Specialist',
        icon: '🎯',
        gradient: 'from-pink-500 to-rose-600',
        description: 'Focused expert'
    }
};
const SIZE_CLASSES = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
};
const ICON_SIZES = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
};
/**
 * PersonaArchetypeBadge - Reusable archetype badge component
 * Displays archetype icon, name, and gradient styling
 */
const PersonaArchetypeBadge = ({ archetypeId, size = 'md', showName = true, className = '' }) => {
    const metadata = ARCHETYPE_METADATA[archetypeId];
    if (!metadata) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `
        inline-flex items-center gap-1.5
        bg-gradient-to-r ${metadata.gradient}
        text-white font-medium
        rounded-full
        shadow-lg
        transition-all duration-200
        hover:shadow-xl hover:scale-105
        ${SIZE_CLASSES[size]}
        ${className}
      `, title: metadata.description, children: [(0, jsx_runtime_1.jsx)("span", { className: ICON_SIZES[size], children: metadata.icon }), showName && ((0, jsx_runtime_1.jsx)("span", { className: "font-semibold", children: metadata.name }))] }));
};
exports.PersonaArchetypeBadge = PersonaArchetypeBadge;
