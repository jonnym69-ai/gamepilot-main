"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeProvider = exports.useTheme = exports.ThemeToggle = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const customisationStore_1 = require("../features/customisation/customisationStore");
const ThemeToggle = ({ className = '', size = 'md' }) => {
    const { theme } = (0, customisationStore_1.useCustomisation)();
    const { setGlobalSettings } = (0, customisationStore_1.useCustomisationActions)();
    const [mounted, setMounted] = (0, react_1.useState)(false);
    // Avoid hydration mismatch
    (0, react_1.useEffect)(() => {
        setMounted(true);
    }, []);
    // Apply theme to document
    (0, react_1.useEffect)(() => {
        if (!mounted)
            return;
        const root = document.documentElement;
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.setAttribute('data-theme', systemTheme);
        }
        else {
            root.setAttribute('data-theme', theme);
        }
    }, [theme, mounted]);
    // Listen for system theme changes when in auto mode
    (0, react_1.useEffect)(() => {
        if (theme !== 'system')
            return;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            const root = document.documentElement;
            root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);
    const toggleTheme = () => {
        const themes = ['dark', 'light', 'system'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setGlobalSettings({ theme: themes[nextIndex] });
    };
    const getThemeIcon = (currentTheme) => {
        switch (currentTheme) {
            case 'dark':
                return '🌙';
            case 'light':
                return '☀️';
            case 'system':
                return '🌓';
            default:
                return '🌙';
        }
    };
    const getThemeLabel = (currentTheme) => {
        switch (currentTheme) {
            case 'dark':
                return 'Dark Mode';
            case 'light':
                return 'Light Mode';
            case 'system':
                return 'Auto Mode';
            default:
                return 'Dark Mode';
        }
    };
    const sizeClasses = {
        sm: 'p-2 text-sm',
        md: 'p-3 text-base',
        lg: 'p-4 text-lg'
    };
    if (!mounted) {
        return ((0, jsx_runtime_1.jsx)("div", { className: `${sizeClasses[size]} ${className}`, children: (0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 bg-gray-700 rounded-full animate-pulse" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("button", { onClick: toggleTheme, className: `
        glass-morphism rounded-lg border border-white/10 
        hover:bg-white/10 transition-all duration-200
        flex items-center space-x-2 group
        ${sizeClasses[size]} ${className}
      `, title: `Current: ${getThemeLabel(theme)}. Click to change theme.`, children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl transition-transform duration-300 group-hover:scale-110", children: getThemeIcon(theme) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 group-hover:text-white transition-colors", children: getThemeLabel(theme) })] }));
};
exports.ThemeToggle = ThemeToggle;
// Hook for using theme
const useTheme = () => {
    const [theme, setTheme] = (0, react_1.useState)('dark');
    (0, react_1.useEffect)(() => {
        const savedTheme = localStorage.getItem('gamepilot-theme');
        if (savedTheme && ['dark', 'light', 'auto'].includes(savedTheme)) {
            setTheme(savedTheme);
        }
    }, []);
    const changeTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('gamepilot-theme', newTheme);
        const root = document.documentElement;
        if (newTheme === 'auto') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.setAttribute('data-theme', systemTheme);
        }
        else {
            root.setAttribute('data-theme', newTheme);
        }
    };
    return { theme, changeTheme };
};
exports.useTheme = useTheme;
// Theme provider component
const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = (0, react_1.useState)('dark');
    (0, react_1.useEffect)(() => {
        // Initialize theme
        const savedTheme = localStorage.getItem('gamepilot-theme');
        const initialTheme = savedTheme && ['dark', 'light', 'auto'].includes(savedTheme)
            ? savedTheme
            : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(initialTheme);
        // Apply theme immediately
        const root = document.documentElement;
        if (initialTheme === 'auto') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.setAttribute('data-theme', systemTheme);
        }
        else {
            root.setAttribute('data-theme', initialTheme);
        }
    }, []);
    (0, react_1.useEffect)(() => {
        const root = document.documentElement;
        if (theme === 'auto') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.setAttribute('data-theme', systemTheme);
            // Listen for system theme changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e) => {
                root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            };
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
        else {
            root.setAttribute('data-theme', theme);
        }
    }, [theme]);
    const changeTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('gamepilot-theme', newTheme);
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "theme-provider", children: react_1.default.Children.map(children, child => react_1.default.isValidElement(child)
            ? react_1.default.cloneElement(child, { theme, changeTheme })
            : child) }));
};
exports.ThemeProvider = ThemeProvider;
