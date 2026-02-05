"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugPanel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// Import persona components for debug display
const persona_1 = require("../../../components/persona");
// Import mock library for persona testing
const mockLibraryWorking_1 = require("../../../debug/mockLibraryWorking");
const useLibraryStore_1 = require("../../../stores/useLibraryStore");
const DebugPanel = ({ games, store, totalPlaytime, currentSession }) => {
    const [isExpanded, setIsExpanded] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsx)("section", { className: "mb-12", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsExpanded(!isExpanded), className: "w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-white flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDD27" }), "Debug Panel"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 transform transition-transform duration-200", style: { transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }, children: "\u25BC" })] }), isExpanded && ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-t border-gray-700", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-white", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Games:" }), (0, jsx_runtime_1.jsx)("div", { className: "font-mono", children: games?.length || 0 })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-white", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Total Playtime:" }), (0, jsx_runtime_1.jsxs)("div", { className: "font-mono", children: [Math.floor(totalPlaytime), "h"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-white", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Store Status:" }), (0, jsx_runtime_1.jsx)("div", { className: "font-mono", children: store ? 'OK' : 'NULL' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-white", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Current Session:" }), (0, jsx_runtime_1.jsx)("div", { className: "font-mono", children: currentSession ? `Game ${currentSession.gameId}` : 'None' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-white", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Session Started:" }), (0, jsx_runtime_1.jsx)("div", { className: "font-mono", children: currentSession
                                                ? new Date(currentSession.startedAt).toLocaleTimeString()
                                                : 'N/A' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-white", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Session Duration:" }), (0, jsx_runtime_1.jsx)("div", { className: "font-mono", children: currentSession
                                                ? `${Math.floor((Date.now() - currentSession.startedAt) / 60000)}m`
                                                : 'N/A' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 pt-4 border-t border-gray-700", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-2", children: "Sample Games with Session Data:" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2 text-xs", children: games?.slice(0, 3).map((game) => ((0, jsx_runtime_1.jsxs)("div", { className: "text-gray-300 font-mono", children: [game.title, ":", (0, jsx_runtime_1.jsxs)("span", { className: "text-gaming-accent ml-2", children: [game.localSessionCount || 0, " sessions,", game.localSessionMinutes || 0, "min total"] })] }, game.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 pt-4 border-t border-gray-700", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-white font-medium mb-2 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83E\uDDE0" }), "Persona Engine (Experimental)"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-gray-300", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-mono text-gaming-accent mb-1", children: "Mock Persona Analysis:" }), (0, jsx_runtime_1.jsx)("div", { children: "Archetype: Explorer (Medium, Flow)" }), (0, jsx_runtime_1.jsx)("div", { children: "Risk: Balanced | Social: Coop" }), (0, jsx_runtime_1.jsx)("div", { children: "Confidence: 75% | Tone: Reflective" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 italic mt-1", children: "\"You're a curious explorer who prefers steady, balanced sessions with a balanced approach to gaming.\"" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-yellow-400 text-xs", children: "\u26A0\uFE0F Persona Engine active - integration ready" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 pt-4 border-t border-gray-700", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-white font-medium mb-3 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAD" }), "Persona Identity Card (Live Demo)"] }), (0, jsx_runtime_1.jsx)(persona_1.PersonaIdentityCard, { persona: {
                                        traits: {
                                            archetypeId: "Explorer",
                                            intensity: "Medium",
                                            pacing: "Flow",
                                            riskProfile: "Balanced",
                                            socialStyle: "Solo",
                                            confidence: 0.75
                                        },
                                        mood: {
                                            moodId: "focused",
                                            intensity: 7,
                                            timestamp: new Date()
                                        },
                                        narrative: {
                                            summary: "You're a curious explorer who prefers steady, balanced sessions with a balanced approach to gaming.",
                                            tone: "Reflective"
                                        },
                                        confidence: 0.75
                                    } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 pt-4 border-t border-gray-700", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-white font-medium mb-3 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDCDA" }), "Persona Test Library"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-gaming-primary hover:bg-gaming-secondary text-white rounded-lg transition-colors text-sm font-medium", onClick: () => {
                                                const libraryStore = useLibraryStore_1.useLibraryStore.getState();
                                                libraryStore.actions.setGames(mockLibraryWorking_1.mockLibraryGames);
                                            }, children: "Load Persona Test Library (25 games)" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400", children: "Loads a diverse synthetic library for persona stress-testing" })] })] })] }))] }) }));
};
exports.DebugPanel = DebugPanel;
