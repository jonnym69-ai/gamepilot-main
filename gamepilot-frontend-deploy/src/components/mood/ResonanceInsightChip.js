"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResonanceInsightChip = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const ResonanceInsightChip = ({ insight, type, value, onClick }) => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const getTypeColor = () => {
        switch (type) {
            case 'accuracy': return 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30';
            case 'pattern': return 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30';
            case 'recommendation': return 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30';
        }
    };
    const getTypeIcon = () => {
        switch (type) {
            case 'accuracy': return '🎯';
            case 'pattern': return '📊';
            case 'recommendation': return '💡';
            default: return 'ℹ️';
        }
    };
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        else {
            // Default navigation based on type
            switch (type) {
                case 'accuracy':
                    navigate('/analytics?view=mood-accuracy');
                    break;
                case 'pattern':
                    navigate('/analytics?view=mood-patterns');
                    break;
                case 'recommendation':
                    navigate('/library?filter=recommended');
                    break;
                default:
                    navigate('/analytics');
            }
        }
    };
    return ((0, jsx_runtime_1.jsxs)("button", { onClick: handleClick, className: `inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm transition-all duration-200 cursor-pointer hover:scale-105 ${getTypeColor()}`, title: `Click to explore ${type} insights`, children: [(0, jsx_runtime_1.jsx)("span", { children: getTypeIcon() }), (0, jsx_runtime_1.jsx)("span", { children: insight }), value !== undefined && ((0, jsx_runtime_1.jsxs)("span", { className: "font-medium", children: [Math.round(value * 100), "%"] })), (0, jsx_runtime_1.jsx)("span", { className: "text-xs opacity-70", children: "\u2192" })] }));
};
exports.ResonanceInsightChip = ResonanceInsightChip;
