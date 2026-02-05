"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteamImportModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useLibraryStore_1 = require("../../../stores/useLibraryStore");
const authStore_1 = require("../../../store/authStore");
const Loading_1 = require("../../../components/Loading");
const SteamImportModal = ({ isOpen, onClose, onImportGames }) => {
    const [steamId, setSteamId] = (0, react_1.useState)('');
    const [importStatus, setImportStatus] = (0, react_1.useState)('');
    const [errorDetails, setErrorDetails] = (0, react_1.useState)('');
    const { actions, isLoading } = (0, useLibraryStore_1.useLibraryStore)();
    const { user } = (0, authStore_1.useAuth)();
    // Auto-fill Steam ID when user is logged in
    (0, react_1.useEffect)(() => {
        if (user?.steamId) {
            setSteamId(user.steamId);
            console.log('🎯 Auto-filled Steam ID from logged-in user:', user.steamId);
        }
    }, [user]);
    const handleImport = async () => {
        console.log('🎮 SteamImportModal: handleImport called!');
        console.log('🎮 SteamImportModal: Steam ID:', steamId);
        if (!steamId) {
            console.log('🎮 SteamImportModal: No Steam ID provided');
            setImportStatus('Steam ID is required');
            setErrorDetails('Please try logging in with Steam again');
            return;
        }
        console.log('🎮 SteamImportModal: Starting import process...');
        setImportStatus('Fetching your Steam library...');
        setErrorDetails('');
        try {
            const apiKey = import.meta.env.VITE_STEAM_API_KEY || '52A301EC230E81BA57BA5155BEB2F6E8';
            console.log('🎮 SteamImportModal: Calling importSteamLibrary with Steam ID:', steamId);
            const result = await actions.importSteamLibrary(steamId, apiKey);
            console.log('🎮 SteamImportModal: Import result:', result);
            if (result.success && result.gameCount > 0) {
                console.log('🎮 SteamImportModal: Import successful! Games:', result.gameCount);
                setImportStatus(`Successfully imported ${result.gameCount} games!`);
                // Keep existing callback for compatibility
                console.log('🎮 SteamImportModal: Calling onImportGames callback with', result.games.length, 'games');
                onImportGames(result.games.map((g) => ({ ...g, id: g.id })));
                setTimeout(() => {
                    console.log('🎮 SteamImportModal: Closing modal...');
                    onClose();
                    setImportStatus('');
                    setErrorDetails('');
                    setSteamId('');
                }, 2000);
            }
            else {
                console.log('🎮 SteamImportModal: No games found');
                setImportStatus('No games found in your Steam library');
                setErrorDetails('Make sure your Steam profile is public and you own games');
            }
        }
        catch (error) {
            console.error('🎮 SteamImportModal: Import error:', error);
            // Enhanced error handling with detailed logging
            let errorMessage = 'Unknown error occurred';
            let errorDetails = 'Please try again later';
            if (error instanceof Error) {
                errorMessage = error.message;
                console.log('🎮 SteamImportModal: Error message:', errorMessage);
                console.log('🎮 SteamImportModal: Error stack:', error.stack);
            }
            else if (typeof error === 'string') {
                errorMessage = error;
            }
            else if (error && typeof error === 'object') {
                errorMessage = 'Steam API request failed';
                errorDetails = JSON.stringify(error, null, 2);
                console.log('🎮 SteamImportModal: Error object:', error);
            }
            // Handle different error types
            if (errorMessage.includes('Invalid Steam Web API key')) {
                setImportStatus('Invalid API Key');
                setErrorDetails('Please check your Steam Web API key and try again');
            }
            else if (errorMessage.includes('Steam profile is private')) {
                setImportStatus('Private Profile');
                setErrorDetails('Please make your Steam profile public and set your game details to public');
            }
            else if (errorMessage.includes('Invalid Steam ID')) {
                setImportStatus('Invalid Steam ID');
                setErrorDetails('Please check your Steam ID and ensure your profile is public');
            }
            else if (errorMessage.includes('Failed to connect') || errorMessage.includes('Failed to fetch')) {
                setImportStatus('Connection Error');
                setErrorDetails('Unable to connect to Steam API. Please check your internet connection and try again.');
            }
            else if (errorMessage.includes('Steam API request failed')) {
                setImportStatus('API Error');
                setErrorDetails('Steam API is temporarily unavailable. Please try again in a few minutes.');
            }
            else {
                setImportStatus('Import Failed');
                setErrorDetails(`${errorMessage}. ${errorDetails}`);
            }
        }
        finally {
            // Loading state is handled globally by the store
            console.log('🎮 SteamImportModal: Import process completed');
        }
    };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto cinematic-shadow", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white", children: "Import Steam Library" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors", children: "\u2715" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Steam ID" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: steamId, onChange: (e) => setSteamId(e.target.value), className: "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gaming-accent focus:outline-none", placeholder: "Your Steam ID (auto-filled from login)", disabled: isLoading || !!user?.steamId }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400 mt-1", children: user?.steamId ? 'Steam ID auto-filled from your login' : 'Find your Steam ID in your profile URL' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800/50 rounded-lg p-3 mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-300 mb-2", children: "Import Your Steam Library" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400", children: "Click \"Import Library\" to fetch all games from your Steam account. This will import game titles, playtime, achievements, and cover images." })] }), (importStatus || errorDetails) && ((0, jsx_runtime_1.jsxs)("div", { className: `p-3 rounded-lg text-sm ${importStatus.includes('Successfully')
                                    ? 'bg-green-600/20 text-green-400 border border-green-600/50'
                                    : 'bg-red-600/20 text-red-400 border border-red-600/50'}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-medium flex items-center gap-2", children: [isLoading && (0, jsx_runtime_1.jsx)(Loading_1.Loading, {}), importStatus] }), errorDetails && (0, jsx_runtime_1.jsx)("div", { className: "text-xs mt-1 opacity-75", children: errorDetails })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onClose, disabled: isLoading, className: "flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleImport, disabled: isLoading || !steamId, className: "flex-1 px-4 py-2 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? 'Importing...' : 'Import Library' })] })] })] }) }) }));
};
exports.SteamImportModal = SteamImportModal;
