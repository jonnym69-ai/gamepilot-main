"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditModeButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const EditModeButton = ({ onClick, isActive = false }) => {
    return ((0, jsx_runtime_1.jsx)("button", { onClick: onClick, className: `
        w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200
        ${isActive
            ? 'bg-gaming-primary text-white shadow-lg shadow-gaming-primary/50'
            : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-white'}
      `, title: "Customise this page", "aria-label": "Customise this page", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" }) }) }));
};
exports.EditModeButton = EditModeButton;
