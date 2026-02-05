"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomisationProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const customisationStore_1 = require("./customisationStore");
require("./customisation.css");
const CustomisationProvider = ({ children, pageId }) => {
    try {
        // Get current page ID if not provided
        const currentPageId = pageId || (0, customisationStore_1.getCurrentPageId)();
        const settings = (0, customisationStore_1.useCustomisation)(currentPageId);
        // Generate CSS custom properties and classes
        const getCustomStyles = () => {
            try {
                const styles = {};
                // Apply background with accent color integration
                if (settings.backgroundMode === 'solid') {
                    styles.backgroundColor = settings.accentColor + '1a'; // Very subtle accent
                    // Add fallback to dark background
                    styles.backgroundColor = '#111827';
                }
                else if (settings.backgroundMode === 'gradient') {
                    // Create gradient using accent color
                    const accent = settings.accentColor;
                    styles.background = `linear-gradient(135deg, ${accent}22 0%, #111827 50%, ${accent}11 100%)`;
                }
                else if (settings.backgroundMode === 'image' && settings.backgroundImageUrl) {
                    styles.backgroundImage = `url(${settings.backgroundImageUrl})`;
                    styles.backgroundSize = 'cover';
                    styles.backgroundPosition = 'center';
                    styles.backgroundRepeat = 'no-repeat';
                    // Add overlay for readability
                    styles.backgroundAttachment = 'fixed';
                }
                return styles;
            }
            catch (error) {
                console.warn('Error generating custom styles:', error);
                return {};
            }
        };
        const getCustomClasses = () => {
            try {
                const classes = ['customisation-provider'];
                // Animation level classes
                if (settings.animationLevel === 'low') {
                    classes.push('animations-low');
                }
                else if (settings.animationLevel === 'high') {
                    classes.push('animations-high');
                }
                else {
                    classes.push('animations-medium');
                }
                // Density classes
                if (settings.density === 'compact') {
                    classes.push('density-compact');
                }
                else {
                    classes.push('density-comfortable');
                }
                // Lighting mode classes (for future RGB sync)
                if (settings.lightingMode === 'mood') {
                    classes.push('lighting-mood');
                }
                else if (settings.lightingMode === 'rgb-sync' && settings.rgbSyncEnabled) {
                    classes.push('lighting-rgb-sync');
                }
                return classes.join(' ');
            }
            catch (error) {
                console.warn('Error generating custom classes:', error);
                return 'customisation-provider';
            }
        };
        // Set CSS custom properties for accent color and enhanced theming
        react_1.default.useEffect(() => {
            try {
                // Only run on client side
                if (typeof window !== 'undefined' && settings) {
                    const root = document.documentElement;
                    const accent = settings.accentColor;
                    // Core accent colors
                    root.style.setProperty('--accent-color', accent);
                    root.style.setProperty('--accent-color-hover', accent + 'dd');
                    root.style.setProperty('--accent-color-light', accent + '33');
                    root.style.setProperty('--accent-color-lighter', accent + '1a');
                    root.style.setProperty('--accent-color-ultralight', accent + '0d');
                    // Enhanced accent variations
                    root.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${accent}, ${accent}dd)`);
                    root.style.setProperty('--accent-glow', `0 0 20px ${accent}33`);
                    root.style.setProperty('--accent-glow-strong', `0 0 40px ${accent}66`);
                    // Background integration
                    if (settings.backgroundMode === 'image' && settings.backgroundImageUrl) {
                        root.style.setProperty('--bg-overlay', 'rgba(0, 0, 0, 0.4)');
                    }
                    else {
                        root.style.setProperty('--bg-overlay', 'transparent');
                    }
                }
            }
            catch (error) {
                console.warn('Error setting CSS custom properties:', error);
            }
        }, [settings?.accentColor, settings?.backgroundMode, settings?.backgroundImageUrl]);
        // Error boundary fallback
        if (!settings) {
            return (0, jsx_runtime_1.jsx)("div", { className: "customisation-provider", children: children });
        }
        return ((0, jsx_runtime_1.jsx)("div", { className: getCustomClasses(), style: getCustomStyles(), "data-page-id": currentPageId, "data-animation-level": settings.animationLevel, "data-density": settings.density, "data-lighting-mode": settings.lightingMode, children: children }));
    }
    catch (error) {
        console.error('Error in CustomisationProvider:', error);
        // Fallback rendering
        return (0, jsx_runtime_1.jsx)("div", { className: "customisation-provider", children: children });
    }
};
exports.CustomisationProvider = CustomisationProvider;
