"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentPageId = exports.useCustomisationActions = exports.useCustomisation = exports.useCustomisationStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
// Default settings
const defaultGlobalSettings = {
    theme: 'dark',
    accentColor: '#3b82f6', // gaming-primary blue
    backgroundMode: 'gradient',
    backgroundImageUrl: undefined,
    animationLevel: 'medium',
    density: 'comfortable',
    lightingMode: 'none',
    rgbSyncEnabled: false,
    // Advanced shape and styling defaults
    defaultBoxShape: 'rounded',
    defaultComponentStyle: 'glass-morphism',
    borderRadius: 12,
    borderWidth: 1,
    shadowIntensity: 50,
    glassOpacity: 80,
    // Component-specific shapes
    cardShape: 'rounded',
    buttonShape: 'rounded',
    inputShape: 'rounded',
    modalShape: 'rounded',
    // Component-specific styles
    cardStyle: 'glass-morphism',
    buttonStyle: 'glass-morphism',
    inputStyle: 'glass-morphism',
    modalStyle: 'glass-morphism',
    // Enhanced typography defaults
    fontFamily: 'inter',
    fontSize: 'base',
    fontWeight: 400,
    // Enhanced animations defaults
    animationStyle: 'smooth',
    hoverEffects: true,
    loadingAnimations: true,
    // Sound themes defaults
    soundTheme: 'minimal',
    soundEnabled: false,
    volume: 50,
};
// Create the store
exports.useCustomisationStore = (0, zustand_1.create)()((0, middleware_1.devtools)((0, middleware_1.persist)((set, get) => ({
    // Initial state
    global: defaultGlobalSettings,
    perPage: {},
    // Actions
    setGlobalSettings: (settings) => set((state) => ({
        global: { ...state.global, ...settings },
    })),
    setPageSettings: (pageId, settings) => set((state) => ({
        perPage: {
            ...state.perPage,
            [pageId]: settings,
        },
    })),
    resetPageSettings: (pageId) => set((state) => {
        const newPerPage = { ...state.perPage };
        delete newPerPage[pageId];
        return { perPage: newPerPage };
    }),
    resetAllSettings: () => set({
        global: defaultGlobalSettings,
        perPage: {},
    }),
    // Getters
    getMergedSettings: (pageId) => {
        const state = get();
        const pageSettings = pageId ? state.perPage[pageId] : {};
        return {
            theme: state.global.theme,
            accentColor: pageSettings?.accentColor ?? state.global.accentColor,
            backgroundMode: pageSettings?.backgroundMode ?? state.global.backgroundMode,
            backgroundImageUrl: pageSettings?.backgroundImageUrl ?? state.global.backgroundImageUrl,
            animationLevel: pageSettings?.animationLevel ?? state.global.animationLevel,
            density: pageSettings?.density ?? state.global.density,
            lightingMode: pageSettings?.lightingMode ?? state.global.lightingMode,
            rgbSyncEnabled: state.global.rgbSyncEnabled,
            // Advanced shape and styling
            defaultBoxShape: state.global.defaultBoxShape,
            defaultComponentStyle: state.global.defaultComponentStyle,
            borderRadius: state.global.borderRadius,
            borderWidth: state.global.borderWidth,
            shadowIntensity: state.global.shadowIntensity,
            glassOpacity: state.global.glassOpacity,
            // Component-specific shapes
            cardShape: state.global.cardShape,
            buttonShape: state.global.buttonShape,
            inputShape: state.global.inputShape,
            modalShape: state.global.modalShape,
            // Component-specific styles
            cardStyle: state.global.cardStyle,
            buttonStyle: state.global.buttonStyle,
            inputStyle: state.global.inputStyle,
            modalStyle: state.global.modalStyle,
            // Enhanced typography
            fontFamily: state.global.fontFamily,
            fontSize: state.global.fontSize,
            fontWeight: state.global.fontWeight,
            // Enhanced animations
            animationStyle: state.global.animationStyle,
            hoverEffects: state.global.hoverEffects,
            loadingAnimations: state.global.loadingAnimations,
            // Sound themes
            soundTheme: state.global.soundTheme,
            soundEnabled: state.global.soundEnabled,
            volume: state.global.volume,
        };
    },
}), {
    name: 'gamepilot-customisation',
    version: 1,
}), {
    name: 'customisation-store',
}));
// Hooks for components
const useCustomisation = (pageId) => {
    const store = (0, exports.useCustomisationStore)();
    return store.getMergedSettings(pageId);
};
exports.useCustomisation = useCustomisation;
const useCustomisationActions = () => {
    const store = (0, exports.useCustomisationStore)();
    return {
        setGlobalSettings: store.setGlobalSettings,
        setPageSettings: store.setPageSettings,
        resetPageSettings: store.resetPageSettings,
        resetAllSettings: store.resetAllSettings,
    };
};
exports.useCustomisationActions = useCustomisationActions;
// Helper to get current page ID from route
const getCurrentPageId = () => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof window.location === 'undefined') {
        return 'default';
    }
    const path = window.location.pathname;
    // Map routes to page IDs
    if (path === '/' || path === '/home')
        return 'home';
    if (path.startsWith('/library'))
        return 'library';
    if (path.startsWith('/analytics'))
        return 'analytics';
    if (path.startsWith('/identity'))
        return 'identity';
    if (path.startsWith('/settings'))
        return 'settings';
    if (path.startsWith('/customisation'))
        return 'customisation';
    // Default fallback
    return 'default';
};
exports.getCurrentPageId = getCurrentPageId;
