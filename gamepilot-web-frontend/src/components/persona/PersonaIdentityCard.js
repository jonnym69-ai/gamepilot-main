"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaIdentityCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const PersonaArchetypeBadge_1 = require("./PersonaArchetypeBadge");
const PersonaMoodPulse_1 = require("./PersonaMoodPulse");
/**
 * Format trait for display
 */
function formatTrait(trait) {
    return trait.charAt(0).toUpperCase() + trait.slice(1);
}
/**
 * Confidence meter component
 */
function ConfidenceMeter({ confidence }) {
    const percentage = Math.round(confidence * 100);
    const colorClass = percentage >= 80 ? 'bg-green-500' :
        percentage >= 60 ? 'bg-yellow-500' :
            'bg-red-500';
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1 bg-gray-700 rounded-full h-2 overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: `h-full ${colorClass} transition-all duration-500 ease-out`, style: { width: `${percentage}%` } }) }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gray-400 font-medium min-w-[3rem] text-right", children: [percentage, "%"] })] }));
}
/**
 * Trait badge component
 */
function TraitBadge({ trait, value }) {
    const traitColors = {
        pacing: 'from-blue-500 to-cyan-500',
        riskProfile: 'from-purple-500 to-pink-500',
        socialStyle: 'from-green-500 to-emerald-500',
        intensity: 'from-orange-500 to-red-500'
    };
    const gradient = traitColors[trait] || 'from-gray-500 to-gray-600';
    return ((0, jsx_runtime_1.jsx)("div", { className: `
        px-2 py-1
        bg-gradient-to-r ${gradient}
        text-white text-xs
        rounded-full
        font-medium
        shadow-sm
      `, children: formatTrait(value) }));
}
/**
 * PersonaIdentityCard - Full-featured persona display card
 * Cinematic design with archetype badge, traits, mood, narrative, and confidence
 */
const PersonaIdentityCard = ({ persona, className = '' }) => {
    const { traits, mood, narrative, confidence } = persona;
    // Skeleton state
    if (!traits || !narrative) {
        return ((0, jsx_runtime_1.jsx)("div", { className: `
        glass-morphism rounded-xl p-6
        border border-gray-700
        ${className}
      `, children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gray-700 rounded-full animate-pulse" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-6 bg-gray-700 rounded animate-pulse w-32" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-700 rounded animate-pulse w-24" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-700 rounded animate-pulse" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-700 rounded animate-pulse w-3/4" }), (0, jsx_runtime_1.jsx)("div", { className: "h-2 bg-gray-700 rounded animate-pulse w-full" })] })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `
      glass-morphism rounded-xl p-6
      border border-gray-700
      shadow-xl
      hover:shadow-2xl
      transition-all duration-300
      ${className}
    `, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(PersonaArchetypeBadge_1.PersonaArchetypeBadge, { archetypeId: traits.archetypeId, size: "lg", showName: true }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-end gap-2", children: [(0, jsx_runtime_1.jsx)(PersonaMoodPulse_1.PersonaMoodPulse, { mood: mood, size: "lg" }), narrative && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-400 font-medium bg-gray-800 px-2 py-1 rounded-full", children: narrative.tone }))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-6", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-200 text-sm leading-relaxed italic", children: ["\"", narrative.summary, "\""] }) }), (0, jsx_runtime_1.jsx)("div", { className: "mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-2", children: [(0, jsx_runtime_1.jsx)(TraitBadge, { trait: "pacing", value: traits.pacing }), (0, jsx_runtime_1.jsx)(TraitBadge, { trait: "riskProfile", value: traits.riskProfile }), (0, jsx_runtime_1.jsx)(TraitBadge, { trait: "socialStyle", value: traits.socialStyle }), (0, jsx_runtime_1.jsx)(TraitBadge, { trait: "intensity", value: traits.intensity })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-400 font-medium uppercase tracking-wide", children: "Confidence" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: "Based on data completeness" })] }), (0, jsx_runtime_1.jsx)(ConfidenceMeter, { confidence: confidence })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 pt-4 border-t border-gray-700", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [(0, jsx_runtime_1.jsx)("span", { children: "Persona Engine v1.0" }), (0, jsx_runtime_1.jsx)("span", { children: "Updated in real-time" })] }) })] }));
};
exports.PersonaIdentityCard = PersonaIdentityCard;
