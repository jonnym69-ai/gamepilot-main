"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaSummaryBar = void 0;
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
 * PersonaSummaryBar - Horizontal compact persona summary
 * Ideal for Library and Game Details headers
 */
const PersonaSummaryBar = ({ persona, compact = false, className = '' }) => {
    const { traits, mood, narrative } = persona;
    if (!traits) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: `flex items-center gap-3 text-gray-400 ${className}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 bg-gray-600 rounded-full" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: "Loading persona..." })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `flex items-center gap-3 ${className}`, children: [(0, jsx_runtime_1.jsx)(PersonaArchetypeBadge_1.PersonaArchetypeBadge, { archetypeId: traits.archetypeId, size: compact ? 'sm' : 'md', showName: !compact }), (0, jsx_runtime_1.jsx)(PersonaMoodPulse_1.PersonaMoodPulse, { mood: mood, size: compact ? 'sm' : 'md' }), !compact && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: formatTrait(traits.pacing) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-500", children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: formatTrait(traits.riskProfile) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-500", children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: formatTrait(traits.socialStyle) })] })), compact && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-xs text-gray-300", children: [(0, jsx_runtime_1.jsx)("span", { children: formatTrait(traits.pacing) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-500", children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { children: formatTrait(traits.riskProfile) })] })), !compact && narrative && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-400 font-medium", children: narrative.tone })] }))] }));
};
exports.PersonaSummaryBar = PersonaSummaryBar;
