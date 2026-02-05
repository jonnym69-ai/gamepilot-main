"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMetadataEnricher = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Loading_1 = require("../../../components/Loading");
const Toast_1 = require("../../../components/Toast");
const errorHandler_1 = require("../../../utils/errorHandler");
const GameMetadataEnricher = ({ game, onEnrichGame, onClose }) => {
    const [sources, setSources] = (0, react_1.useState)([
        {
            name: 'Steam Store',
            description: 'Fetch latest store data, reviews, and media',
            icon: '🎮',
            isAvailable: false
        },
        {
            name: 'IGDB',
            description: 'Get comprehensive game information and ratings',
            icon: '🎯',
            isAvailable: false
        },
        {
            name: 'Metacritic',
            description: 'Import critic and user scores',
            icon: '⭐',
            isAvailable: false
        },
        {
            name: 'Steam Grid',
            description: 'Download high-quality cover images and logos',
            icon: '🖼️',
            isAvailable: false
        }
    ]);
    const [selectedSources, setSelectedSources] = (0, react_1.useState)([]);
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const { handleAsyncError } = (0, errorHandler_1.useErrorHandler)();
    // Check which sources are available for this game
    (0, react_1.useEffect)(() => {
        checkAvailableSources();
    }, [game]);
    const checkAvailableSources = async () => {
        const updatedSources = sources.map(source => {
            let isAvailable = false;
            if (source.name === 'Steam Store' && game.id?.startsWith('steam-')) {
                isAvailable = true;
            }
            else if (source.name === 'IGDB') {
                // IGDB is available for all games (we can search by title)
                isAvailable = true;
            }
            else if (source.name === 'Metacritic') {
                // Metacritic is available for popular games
                isAvailable = true;
            }
            else if (source.name === 'Steam Grid') {
                // Steam Grid is available for Steam games
                isAvailable = game.id?.startsWith('steam-') || false;
            }
            return { ...source, isAvailable };
        });
        setSources(updatedSources);
    };
    const handleSourceToggle = (sourceName) => {
        setSelectedSources(prev => prev.includes(sourceName)
            ? prev.filter(s => s !== sourceName)
            : [...prev, sourceName]);
    };
    const enrichFromSteam = async () => {
        // Mock Steam API enrichment
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            coverImage: `https://cdn.akamai.steamstatic.com/steam/apps/${game.id?.replace('steam-', '')}/header.jpg`,
            globalRating: Math.random() * 5,
            description: `Enhanced description for ${game.title} from Steam Store`,
            developer: 'Enhanced Developer Studio',
            publisher: 'Enhanced Publisher'
        };
    };
    const enrichFromIGDB = async () => {
        // Mock IGDB enrichment
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            globalRating: Math.random() * 5,
            description: `Comprehensive description for ${game.title} from IGDB database`,
            releaseYear: new Date().getFullYear() - Math.floor(Math.random() * 10),
            tags: [...(game.tags || []), 'action', 'adventure', 'story-rich']
        };
    };
    const enrichFromMetacritic = async () => {
        // Mock Metacritic enrichment
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            globalRating: Math.random() * 5,
            userRating: Math.random() * 5
        };
    };
    const enrichFromSteamGrid = async () => {
        // Mock Steam Grid enrichment
        await new Promise(resolve => setTimeout(resolve, 1200));
        return {
            coverImage: `https://steamcdn-a.akamaihd.net/steam/apps/${game.id?.replace('steam-', '')}/library_600x900.jpg`
        };
    };
    const processEnrichment = async () => {
        if (selectedSources.length === 0) {
            Toast_1.toast.warning('No sources selected', 'Please select at least one enrichment source');
            return;
        }
        setIsProcessing(true);
        const enrichedData = {};
        try {
            for (const sourceName of selectedSources) {
                // Update source loading state
                setSources(prev => prev.map(s => s.name === sourceName ? { ...s, isLoading: true, error: undefined } : s));
                try {
                    let data = {};
                    switch (sourceName) {
                        case 'Steam Store':
                            data = await enrichFromSteam();
                            break;
                        case 'IGDB':
                            data = await enrichFromIGDB();
                            break;
                        case 'Metacritic':
                            data = await enrichFromMetacritic();
                            break;
                        case 'Steam Grid':
                            data = await enrichFromSteamGrid();
                            break;
                    }
                    // Merge enriched data
                    Object.assign(enrichedData, data);
                    // Update source success state
                    setSources(prev => prev.map(s => s.name === sourceName ? { ...s, isLoading: false, data } : s));
                }
                catch (error) {
                    // Update source error state
                    setSources(prev => prev.map(s => s.name === sourceName ? {
                        ...s,
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Failed to fetch data'
                    } : s));
                }
            }
            // Apply enrichment to game
            if (Object.keys(enrichedData).length > 0) {
                onEnrichGame(game.id, enrichedData);
                Toast_1.toast.success('Game enriched successfully', `Added ${Object.keys(enrichedData).length} new fields`);
                setTimeout(onClose, 1500);
            }
            else {
                Toast_1.toast.warning('No new data found', 'Try different enrichment sources');
            }
        }
        catch (error) {
            handleAsyncError(() => Promise.reject(error), 'game metadata enrichment');
        }
        finally {
            setIsProcessing(false);
        }
    };
    const getEnrichmentSummary = () => {
        const availableCount = sources.filter(s => s.isAvailable).length;
        const selectedCount = selectedSources.length;
        if (availableCount === 0) {
            return 'No enrichment sources available for this game';
        }
        return `${selectedCount} of ${availableCount} sources selected`;
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-white", children: "Enrich Game Metadata" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: "\u00D7" })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mb-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-20 bg-gray-800 rounded-lg flex items-center justify-center", children: game.coverImage ? ((0, jsx_runtime_1.jsx)("img", { src: game.coverImage, alt: game.title, className: "w-full h-full object-cover rounded-lg" })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAE" })) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white", children: game.title }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-400", children: ["ID: ", game.id] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2 mt-2", children: game.genres?.slice(0, 2).map(genre => ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-gray-800 rounded text-xs text-gray-300", children: genre.name }, genre.id))) })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white", children: "Available Enrichment Sources" }), sources.map(source => ((0, jsx_runtime_1.jsx)("div", { className: `
                border rounded-lg p-4 transition-all
                ${source.isAvailable
                                ? 'border-gray-700 hover:border-gray-600 cursor-pointer'
                                : 'border-gray-800 opacity-50 cursor-not-allowed'}
                ${selectedSources.includes(source.name) ? 'bg-gray-800 border-blue-600' : ''}
              `, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedSources.includes(source.name), onChange: () => handleSourceToggle(source.name), disabled: !source.isAvailable || source.isLoading, className: "w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: source.icon }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium text-white", children: source.name })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: source.description })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [source.isLoading && (0, jsx_runtime_1.jsx)(Loading_1.Loading, { size: "sm" }), source.error && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs text-red-400", children: source.error })), source.data && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs text-green-400", children: "\u2713 Enriched" }))] })] }) }, source.name)))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: getEnrichmentSummary() }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { onClick: processEnrichment, disabled: isProcessing || selectedSources.length === 0, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children: isProcessing ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Loading_1.Loading, { size: "sm" }), "Enriching..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { children: "\u2728" }), "Enrich Game"] })) })] })] })] }) }));
};
exports.GameMetadataEnricher = GameMetadataEnricher;
