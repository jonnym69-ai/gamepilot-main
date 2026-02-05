"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationTuningPanel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const DEFAULT_SETTINGS = {
    personaWeight: 0.4,
    moodWeight: 0.3,
    sessionLengthWeight: 0.2,
    timeOfDayWeight: 0.1,
    playPatternWeight: 0.15,
    autoTaggingAggressiveness: 0.5
};
const RecommendationTuningPanel = () => {
    const [settings, setSettings] = (0, react_1.useState)(DEFAULT_SETTINGS);
    const [sampleGames, setSampleGames] = (0, react_1.useState)([]);
    // Load settings from localStorage
    (0, react_1.useEffect)(() => {
        try {
            const stored = localStorage.getItem('tuning_settings');
            if (stored) {
                setSettings(JSON.parse(stored));
            }
        }
        catch (error) {
            console.warn('Failed to load tuning settings:', error);
        }
    }, []);
    // Save settings to localStorage
    const saveSettings = (newSettings) => {
        try {
            localStorage.setItem('tuning_settings', JSON.stringify(newSettings));
            setSettings(newSettings);
            // Trigger re-evaluation of recommendations
            window.dispatchEvent(new CustomEvent('tuning-settings-changed', {
                detail: newSettings
            }));
        }
        catch (error) {
            console.warn('Failed to save tuning settings:', error);
        }
    };
    // Reset to defaults
    const resetToDefaults = () => {
        saveSettings(DEFAULT_SETTINGS);
    };
    // Update individual setting
    const updateSetting = (key, value) => {
        saveSettings({
            ...settings,
            [key]: Math.max(0, Math.min(1, value)) // Clamp between 0 and 1
        });
    };
    // Calculate sample scores for live preview
    (0, react_1.useEffect)(() => {
        // Create sample games for demonstration
        const sampleData = [
            {
                game: {
                    id: 'sample-1',
                    title: 'Hades',
                    moods: ['chill', 'competitive'],
                    sessionLength: 'medium',
                    recommendedTimes: ['evening', 'late-night'],
                    hoursPlayed: 25,
                    playStatus: 'playing'
                }
            },
            {
                game: {
                    id: 'sample-2',
                    title: 'Stardew Valley',
                    moods: ['cozy', 'creative'],
                    sessionLength: 'long',
                    recommendedTimes: ['afternoon', 'evening'],
                    hoursPlayed: 120,
                    playStatus: 'completed'
                }
            },
            {
                game: {
                    id: 'sample-3',
                    title: 'Celeste',
                    moods: ['focused', 'intense'],
                    sessionLength: 'short',
                    recommendedTimes: ['morning', 'afternoon'],
                    hoursPlayed: 8,
                    playStatus: 'playing'
                }
            }
        ];
        // Calculate scores with current settings
        const calculatedScores = sampleData.map(({ game }) => {
            const breakdown = {
                persona: Math.random() * 100 * settings.personaWeight,
                mood: game.moods.length * 20 * settings.moodWeight,
                sessionLength: 50 * settings.sessionLengthWeight,
                timeOfDay: game.recommendedTimes.length * 15 * settings.timeOfDayWeight,
                playPattern: game.hoursPlayed > 50 ? 30 * settings.playPatternWeight : 10 * settings.playPatternWeight
            };
            return {
                game,
                totalScore: Object.values(breakdown).reduce((sum, score) => sum + score, 0),
                breakdown
            };
        });
        setSampleGames(calculatedScores);
    }, [settings]);
    // Slider component
    const TuningSlider = ({ label, value, onChange, description }) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-white font-medium", children: label }), (0, jsx_runtime_1.jsx)("span", { className: "text-blue-400 font-mono text-sm", children: value.toFixed(2) })] }), (0, jsx_runtime_1.jsx)("input", { type: "range", min: "0", max: "1", step: "0.01", value: value, onChange: (e) => onChange(parseFloat(e.target.value)), className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider", "aria-label": label }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-xs mt-1", children: description })] }));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white mb-2", children: "\uD83C\uDF9B\uFE0F Recommendation Tuning Panel" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "Real-time adjustment of recommendation engine weights and scoring parameters" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: resetToDefaults, className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors", children: "Reset to Defaults" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(TuningSlider, { label: "Persona Weight", value: settings.personaWeight, onChange: (value) => updateSetting('personaWeight', value), description: "Influence of user's long-term gaming patterns and behavior" }), (0, jsx_runtime_1.jsx)(TuningSlider, { label: "Mood Weight", value: settings.moodWeight, onChange: (value) => updateSetting('moodWeight', value), description: "Importance of mood matching in recommendations" }), (0, jsx_runtime_1.jsx)(TuningSlider, { label: "Session Length Weight", value: settings.sessionLengthWeight, onChange: (value) => updateSetting('sessionLengthWeight', value), description: "How much session duration preferences affect scoring" }), (0, jsx_runtime_1.jsx)(TuningSlider, { label: "Time of Day Weight", value: settings.timeOfDayWeight, onChange: (value) => updateSetting('timeOfDayWeight', value), description: "Influence of current time on game recommendations" }), (0, jsx_runtime_1.jsx)(TuningSlider, { label: "Play Pattern Weight", value: settings.playPatternWeight, onChange: (value) => updateSetting('playPatternWeight', value), description: "Impact of user's play history and completion patterns" }), (0, jsx_runtime_1.jsx)(TuningSlider, { label: "Auto-tagging Aggressiveness", value: settings.autoTaggingAggressiveness, onChange: (value) => updateSetting('autoTaggingAggressiveness', value), description: "How aggressively to infer contextual data from game metadata" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-semibold mb-4", children: "\uD83D\uDD0D Live Preview" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 text-sm mb-4", children: "Sample games scored with current tuning settings" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: sampleGames.map(({ game, totalScore, breakdown }) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-black/20 rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium", children: game.title }), (0, jsx_runtime_1.jsxs)("span", { className: "text-green-400 font-mono text-sm", children: ["Score: ", totalScore.toFixed(1)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Persona:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-24 bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-purple-500 rounded-full", style: { width: `${(breakdown.persona / 100) * 100}%` } }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 w-12 text-right", children: breakdown.persona.toFixed(1) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Mood:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-24 bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-blue-500 rounded-full", style: { width: `${(breakdown.mood / 100) * 100}%` } }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 w-12 text-right", children: breakdown.mood.toFixed(1) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Session:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-24 bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-green-500 rounded-full", style: { width: `${(breakdown.sessionLength / 100) * 100}%` } }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 w-12 text-right", children: breakdown.sessionLength.toFixed(1) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Time:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-24 bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-yellow-500 rounded-full", style: { width: `${(breakdown.timeOfDay / 100) * 100}%` } }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 w-12 text-right", children: breakdown.timeOfDay.toFixed(1) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Pattern:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-24 bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-red-500 rounded-full", style: { width: `${(breakdown.playPattern / 100) * 100}%` } }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 w-12 text-right", children: breakdown.playPattern.toFixed(1) })] })] })] })] }, game.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-semibold mb-3", children: "Current Settings" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Persona:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white ml-2", children: settings.personaWeight.toFixed(2) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Mood:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white ml-2", children: settings.moodWeight.toFixed(2) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Session:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white ml-2", children: settings.sessionLengthWeight.toFixed(2) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Time:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white ml-2", children: settings.timeOfDayWeight.toFixed(2) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Pattern:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white ml-2", children: settings.playPatternWeight.toFixed(2) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Tagging:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white ml-2", children: settings.autoTaggingAggressiveness.toFixed(2) })] })] })] })] }));
};
exports.RecommendationTuningPanel = RecommendationTuningPanel;
