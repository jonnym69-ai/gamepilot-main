"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIntegrationsActions = exports.useIntegrations = exports.useIntegrationsStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
const integrationsApi_1 = require("../../services/integrationsApi");
// Default integration state
const defaultIntegrationState = {
    steamConnected: false,
    discordConnected: false,
    youtubeConnected: false,
    gogConnected: false,
    epicConnected: false,
};
// Create the store
exports.useIntegrationsStore = (0, zustand_1.create)()((0, middleware_1.devtools)((0, middleware_1.persist)((set, get) => ({
    // Initial state
    ...defaultIntegrationState,
    // Actions
    setIntegration: (name, value) => set(() => ({
        [name]: value,
    })),
    setIntegrationData: (name, data) => set(() => ({
        [name]: data,
    })),
    loadIntegrationsFromServer: async () => {
        try {
            const data = await integrationsApi_1.integrationsApi.getIntegrations();
            set(data);
        }
        catch (error) {
            console.error('Failed to load integrations from server:', error);
            // Keep current state if server fails
        }
    },
    syncIntegrationsToServer: async () => {
        try {
            const currentState = get();
            await integrationsApi_1.integrationsApi.setIntegrations(currentState);
        }
        catch (error) {
            console.error('Failed to sync integrations to server:', error);
        }
    },
    resetIntegrations: () => set(defaultIntegrationState),
    // Steam integration methods
    connectSteam: async () => {
        try {
            const steamData = await integrationsApi_1.integrationsApi.connectSteam();
            set(() => ({
                steamConnected: steamData.success,
                steamUsername: steamData.username,
                steamAvatarUrl: steamData.avatarUrl,
            }));
            return steamData;
        }
        catch (error) {
            console.error('Failed to connect Steam:', error);
            throw error;
        }
    },
    disconnectSteam: async () => {
        try {
            const result = await integrationsApi_1.integrationsApi.disconnectSteam();
            set(() => ({
                steamConnected: false,
                steamUsername: undefined,
                steamAvatarUrl: undefined,
            }));
            return result;
        }
        catch (error) {
            console.error('Failed to disconnect Steam:', error);
            throw error;
        }
    },
    // Discord integration methods
    connectDiscord: async () => {
        try {
            const discordData = await integrationsApi_1.integrationsApi.connectDiscord();
            set(() => ({
                discordConnected: discordData.success,
                discordUsername: discordData.username,
            }));
            return discordData;
        }
        catch (error) {
            console.error('Failed to connect Discord:', error);
            throw error;
        }
    },
    disconnectDiscord: async () => {
        try {
            const result = await integrationsApi_1.integrationsApi.disconnectDiscord();
            set(() => ({
                discordConnected: false,
                discordUsername: undefined,
            }));
            return result;
        }
        catch (error) {
            console.error('Failed to disconnect Discord:', error);
            throw error;
        }
    },
}), {
    name: 'gamepilot-integrations',
    version: 1,
}), {
    name: 'integrations-store',
}));
// Hooks for components
const useIntegrations = () => {
    const store = (0, exports.useIntegrationsStore)();
    return {
        steamConnected: store.steamConnected,
        discordConnected: store.discordConnected,
        youtubeConnected: store.youtubeConnected,
        gogConnected: store.gogConnected,
        epicConnected: store.epicConnected,
        steamUsername: store.steamUsername,
        steamAvatarUrl: store.steamAvatarUrl,
        discordUsername: store.discordUsername,
        youtubeChannelId: store.youtubeChannelId,
        gogUsername: store.gogUsername,
        epicUsername: store.epicUsername,
    };
};
exports.useIntegrations = useIntegrations;
const useIntegrationsActions = () => {
    const store = (0, exports.useIntegrationsStore)();
    return {
        setIntegration: store.setIntegration,
        setIntegrationData: store.setIntegrationData,
        loadIntegrationsFromServer: store.loadIntegrationsFromServer,
        syncIntegrationsToServer: store.syncIntegrationsToServer,
        resetIntegrations: store.resetIntegrations,
        connectSteam: store.connectSteam,
        disconnectSteam: store.disconnectSteam,
        connectDiscord: store.connectDiscord,
        disconnectDiscord: store.disconnectDiscord,
    };
};
exports.useIntegrationsActions = useIntegrationsActions;
