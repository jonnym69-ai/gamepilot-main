"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const TagsList = ({ tags, className = '' }) => {
    if (!tags || tags.length === 0) {
        return null;
    }
    const getTagColor = (tag) => {
        const colors = [
            'from-blue-500 to-cyan-500',
            'from-purple-500 to-pink-500',
            'from-green-500 to-emerald-500',
            'from-yellow-500 to-amber-500',
            'from-red-500 to-orange-500',
            'from-indigo-500 to-purple-500',
            'from-gray-500 to-gray-600',
            'from-teal-500 to-cyan-500'
        ];
        const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[index % colors.length];
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: `flex flex-wrap gap-2 ${className}`, children: tags.map((tag) => ((0, jsx_runtime_1.jsx)("span", { className: `px-3 py-1 bg-gradient-to-r ${getTagColor(tag.description)} rounded-full text-xs text-white font-medium`, children: tag.description }, tag.id))) }));
};
exports.TagsList = TagsList;
