"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeSelector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const themeUtils_1 = require("../utils/themeUtils");
const ThemeSelector = ({ onThemeChange }) => {
    const [currentTheme, setCurrentTheme] = (0, react_1.useState)((0, themeUtils_1.getThemeById)((0, themeUtils_1.getSavedTheme)()));
    (0, react_1.useEffect)(() => {
        // Apply saved theme on mount
        (0, themeUtils_1.applyTheme)(currentTheme.id);
    }, []);
    const handleThemeSelect = (themeId) => {
        const theme = (0, themeUtils_1.getThemeById)(themeId);
        if (theme) {
            setCurrentTheme(theme);
            (0, themeUtils_1.applyTheme)(theme.id);
            (0, themeUtils_1.saveThemePreference)(theme.id);
            onThemeChange?.(theme);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white text-sm", children: "Theme:" }), (0, jsx_runtime_1.jsx)("select", { value: currentTheme.id, onChange: (e) => handleThemeSelect(e.target.value), className: "px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gaming-accent focus:outline-none text-sm", children: themeUtils_1.themes.map((theme) => ((0, jsx_runtime_1.jsx)("option", { value: theme.id, children: theme.name }, theme.id))) }), (0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 rounded-full border-2 border-gray-700", style: {
                    background: `linear-gradient(135deg, ${currentTheme.primary})`,
                    borderColor: currentTheme.accent
                } })] }));
};
exports.ThemeSelector = ThemeSelector;
