"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleMoodSelector = SimpleMoodSelector;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const static_data_1 = require("@gamepilot/static-data");
function SimpleMoodSelector({ onMoodChange, className = '', variant = 'compact' }) {
    const [primaryMood, setPrimaryMood] = (0, react_1.useState)(null);
    const [secondaryMood, setSecondaryMood] = (0, react_1.useState)(null);
    const [showSecondary, setShowSecondary] = (0, react_1.useState)(false);
    const handlePrimaryMoodSelect = (0, react_1.useCallback)((moodId) => {
        setPrimaryMood(moodId);
        // Reset secondary if it conflicts (basic compatibility check)
        if (secondaryMood) {
            const primary = static_data_1.MOODS.find(m => m.id === moodId);
            // Simple conflict check for basic moods
            if (primary && ((primary.id === 'competitive' && secondaryMood === 'chill') ||
                (primary.id === 'chill' && secondaryMood === 'competitive'))) {
                setSecondaryMood(null);
                setShowSecondary(false);
            }
        }
        // Call parent callback
        if (onMoodChange) {
            onMoodChange(moodId, secondaryMood || undefined);
        }
    }, [secondaryMood, onMoodChange]);
    const handleSecondaryMoodSelect = (0, react_1.useCallback)((moodId) => {
        if (!primaryMood)
            return;
        // Simple compatibility check for basic moods
        const primary = static_data_1.MOODS.find(m => m.id === primaryMood);
        if (primary && !((primary.id === 'competitive' && moodId === 'chill') ||
            (primary.id === 'chill' && moodId === 'competitive'))) {
            setSecondaryMood(moodId);
            if (onMoodChange) {
                onMoodChange(primaryMood, moodId);
            }
        }
    }, [primaryMood, onMoodChange]);
    const clearMoods = (0, react_1.useCallback)(() => {
        setPrimaryMood(null);
        setSecondaryMood(null);
        setShowSecondary(false);
        if (onMoodChange) {
            onMoodChange('', undefined);
        }
    }, [onMoodChange]);
    const getMoodButtonClasses = (mood, isActive, isSecondary = false) => {
        const baseClasses = 'relative flex flex-col items-center justify-center rounded-lg transition-all duration-300 cursor-pointer';
        const sizeClasses = variant === 'compact'
            ? 'w-12 h-12 text-sm p-2'
            : 'w-16 h-16 text-base p-3';
        const activeClasses = isActive
            ? isSecondary
                ? 'ring-2 ring-purple-500 bg-purple-500/20 scale-110'
                : 'ring-2 ring-blue-500 bg-blue-500/20 scale-110'
            : 'hover:bg-gray-700/50 hover:scale-105';
        return `${baseClasses} ${sizeClasses} ${activeClasses} ${mood.color}`;
    };
    const getEnergyIndicator = (energyLevel) => {
        const filledBars = Math.ceil(energyLevel / 2);
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex gap-0.5 mt-1", children: Array.from({ length: 5 }).map((_, i) => ((0, jsx_runtime_1.jsx)("div", { className: `w-1 h-1 rounded-full ${i < filledBars ? 'bg-white/80' : 'bg-white/20'}` }, i))) }));
    };
    const primaryMoodData = primaryMood ? static_data_1.MOODS.find(m => m.id === primaryMood) : undefined;
    const secondaryMoodData = secondaryMood ? static_data_1.MOODS.find(m => m.id === secondaryMood) : undefined;
    if (variant === 'compact') {
        return ((0, jsx_runtime_1.jsxs)("div", { className: `glass-morphism rounded-xl p-4 ${className}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-semibold", children: "How are you feeling?" }), (primaryMood || secondaryMood) && ((0, jsx_runtime_1.jsx)("button", { onClick: clearMoods, className: "text-xs text-gray-400 hover:text-white transition-colors", children: "Clear" }))] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-4 gap-2 mb-3", children: static_data_1.MOODS.map((mood) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => handlePrimaryMoodSelect(mood.id), className: getMoodButtonClasses(mood, mood.id === primaryMood), title: mood.name, children: [(0, jsx_runtime_1.jsx)("span", { className: "text-lg mb-1", children: mood.emoji }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-white font-medium", children: mood.name })] }, mood.id))) }), primaryMood && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-300", children: "Add secondary mood?" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowSecondary(!showSecondary), className: "text-xs text-blue-400 hover:text-blue-300 transition-colors", children: showSecondary ? 'Hide' : 'Show' })] }), showSecondary && ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-4 gap-2", children: static_data_1.MOODS
                                .filter(mood => mood.id !== primaryMood)
                                .map((mood) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => handleSecondaryMoodSelect(mood.id), className: getMoodButtonClasses(mood, mood.id === secondaryMood, true), title: mood.name, children: [(0, jsx_runtime_1.jsx)("span", { className: "text-lg mb-1", children: mood.emoji }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-white font-medium", children: mood.name })] }, mood.id))) }))] })), (primaryMoodData || secondaryMoodData) && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-3 p-2 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [primaryMoodData && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: primaryMoodData.emoji }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-white", children: primaryMoodData.name })] })), secondaryMoodData && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "+" }), (0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: secondaryMoodData.emoji }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-white", children: secondaryMoodData.name })] }))] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-400 mt-1", children: [primaryMoodData?.description, secondaryMoodData && ` + ${secondaryMoodData.description}`] })] }))] }));
    }
    // Full variant
    return ((0, jsx_runtime_1.jsxs)("div", { className: `glass-morphism rounded-2xl p-6 ${className}`, children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-white mb-4", children: "Select Your Gaming Mood" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm mb-6", children: "Choose how you're feeling to get personalized game recommendations" }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-3", children: "Primary Mood" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-4 gap-3", children: static_data_1.MOODS.map((mood) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => handlePrimaryMoodSelect(mood.id), className: getMoodButtonClasses(mood, mood.id === primaryMood), title: mood.name, children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl mb-1", children: mood.emoji }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-white font-medium", children: mood.name })] }, mood.id))) })] }), primaryMood && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white", children: "Secondary Mood (Optional)" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowSecondary(!showSecondary), className: "text-sm text-blue-400 hover:text-blue-300 transition-colors", children: showSecondary ? 'Hide' : 'Add Secondary Mood' })] }), showSecondary && ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-4 gap-3", children: static_data_1.MOODS
                            .filter(mood => mood.id !== primaryMood)
                            .map((mood) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => handleSecondaryMoodSelect(mood.id), className: getMoodButtonClasses(mood, mood.id === secondaryMood, true), title: mood.name, children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl mb-1", children: mood.emoji }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-white font-medium", children: mood.name })] }, mood.id))) }))] })), (primaryMoodData || secondaryMoodData) && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800/30 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-2", children: "Current Selection" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mb-2", children: [primaryMoodData && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: primaryMoodData.emoji }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: primaryMoodData.name })] })), secondaryMoodData && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "+" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: secondaryMoodData.emoji }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: secondaryMoodData.name })] })] })), (0, jsx_runtime_1.jsx)("button", { onClick: clearMoods, className: "ml-auto text-sm text-gray-400 hover:text-white transition-colors", children: "Clear" })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-400", children: [primaryMoodData?.description, secondaryMoodData && ` + ${secondaryMoodData.description}`] })] }))] }));
}
