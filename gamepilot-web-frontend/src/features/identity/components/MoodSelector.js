"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodSelector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const types_1 = require("../types");
const localStorage_1 = require("../services/localStorage");
const MoodSelector = ({ onMoodsUpdate }) => {
    const [userMoods, setUserMoods] = (0, react_1.useState)([]);
    const [customMoods, setCustomMoods] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [showAddMood, setShowAddMood] = (0, react_1.useState)(false);
    const [editingMood, setEditingMood] = (0, react_1.useState)(null);
    const localStorageService = new localStorage_1.LocalStorageService();
    const [newMood, setNewMood] = (0, react_1.useState)({
        id: '',
        name: '',
        emoji: '😊',
        color: 'from-gray-500 to-gray-600',
        frequency: 1,
        preference: 0,
        associatedGenres: []
    });
    (0, react_1.useEffect)(() => {
        const loadMoods = () => {
            const savedMoods = localStorageService.getUserMoods();
            setUserMoods(savedMoods);
            // Load custom moods (those not in predefined MOODS)
            const custom = savedMoods.filter(mood => !types_1.MOODS.find(predefined => predefined.id === mood.id));
            setCustomMoods(custom.map(m => ({
                id: m.id,
                name: m.name,
                emoji: m.emoji,
                color: m.color,
                frequency: m.frequency || 1,
                preference: m.preference || 0,
                associatedGenres: m.associatedGenres || []
            })));
            setIsLoading(false);
        };
        loadMoods();
    }, []);
    const handleMoodToggle = (moodId) => {
        let updatedMoods = [...userMoods];
        const existingMood = userMoods.find(m => m.id === moodId);
        if (existingMood) {
            // Remove mood
            updatedMoods = userMoods.filter(m => m.id !== moodId);
        }
        else {
            // Add mood with default preference
            const moodTemplate = [...types_1.MOODS].find(m => m.id === moodId);
            if (moodTemplate) {
                const newMood = {
                    ...moodTemplate,
                    preference: 50, // Default preference
                    frequency: 1 // Default frequency
                };
                updatedMoods = [...userMoods, newMood];
            }
            else {
                updatedMoods = userMoods;
            }
        }
        setUserMoods(updatedMoods);
        localStorageService.setUserMoods(updatedMoods);
        localStorageService.setUserMoods(updatedMoods);
        localStorageService.setUserMoods(updatedMoods);
        localStorageService.setUserMoods(updatedMoods);
        localStorageService.setUserMoods(updatedMoods);
        onMoodsUpdate?.(updatedMoods);
    };
    const handleAddCustomMood = () => {
        if (!newMood.name?.trim())
            return;
        const newMoodObj = {
            id: `custom-${Date.now()}`,
            name: newMood.name.trim(),
            emoji: newMood.emoji || '😊',
            color: newMood.color || 'from-gray-500 to-gray-600',
            frequency: 1,
            preference: 0,
            associatedGenres: newMood.associatedGenres || []
        };
        setCustomMoods([...customMoods, newMoodObj]);
        setNewMood({ id: '', name: '', emoji: '😊', color: 'from-gray-500 to-gray-600', frequency: 1, preference: 0, associatedGenres: [] });
        setShowAddMood(false);
        setUserMoods([...userMoods, newMoodObj]);
        localStorageService.setUserMoods([...userMoods, newMoodObj]);
    };
    const handleUpdateCustomMood = (moodId, updates) => {
        setCustomMoods(customMoods.map(m => m.id === moodId ? { ...m, ...updates } : m));
        // Also update in userMoods if it's selected
        setUserMoods(userMoods.map(m => m.id === moodId ? { ...m, ...updates } : m));
        localStorageService.setUserMoods(userMoods);
        localStorageService.setUserMoods(userMoods);
        localStorageService.setUserMoods(userMoods);
        localStorageService.setUserMoods(userMoods);
        localStorageService.setUserMoods(userMoods);
        onMoodsUpdate?.(userMoods);
    };
    const handleRemoveCustomMood = (moodId) => {
        setCustomMoods(customMoods.filter(m => m.id !== moodId));
        // Also remove from userMoods if it's selected
        const updatedUserMoods = userMoods.filter(m => m.id !== moodId);
        setUserMoods(updatedUserMoods);
        localStorageService.setUserMoods(updatedUserMoods);
        localStorageService.setUserMoods(updatedUserMoods);
        localStorageService.setUserMoods(updatedUserMoods);
        localStorageService.setUserMoods(updatedUserMoods);
        onMoodsUpdate?.(updatedUserMoods);
    };
    const handleReorderMoods = (fromIndex, toIndex) => {
        const reordered = [...userMoods];
        const [moved] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, moved);
        setUserMoods(reordered);
        localStorageService.setUserMoods(reordered);
        onMoodsUpdate?.(reordered);
    };
    const handlePreferenceChange = (moodId, preference) => {
        const updatedMoods = userMoods.map(mood => mood.id === moodId ? { ...mood, preference } : mood);
        setUserMoods(updatedMoods);
        localStorageService.setUserMoods(updatedMoods);
        onMoodsUpdate?.(updatedMoods);
    };
    const handleFrequencyChange = (moodId, frequency) => {
        const updatedMoods = userMoods.map(mood => mood.id === moodId ? { ...mood, frequency } : mood);
        setUserMoods(updatedMoods);
        localStorageService.setUserMoods(updatedMoods);
        onMoodsUpdate?.(updatedMoods);
    };
    const getPreferenceColor = (preference) => {
        if (preference >= 80)
            return 'from-purple-500 to-pink-600';
        if (preference >= 60)
            return 'from-blue-500 to-cyan-600';
        if (preference >= 40)
            return 'from-green-500 to-teal-600';
        return 'from-gray-500 to-gray-600';
    };
    const getPreferenceLabel = (preference) => {
        if (preference >= 80)
            return 'Love';
        if (preference >= 60)
            return 'Like';
        if (preference >= 40)
            return 'Sometimes';
        return 'Rarely';
    };
    const getFrequencyLabel = (frequency) => {
        if (frequency >= 5)
            return 'Very Often';
        if (frequency >= 3)
            return 'Often';
        if (frequency >= 1)
            return 'Sometimes';
        return 'Rarely';
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-xl mx-auto mb-4 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\uD83D\uDE0A" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Loading moods..." })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 cinematic-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-semibold text-white flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDE0A" }), "Gaming Moods"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-400", children: [userMoods.length, " selected"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-6 p-4 bg-gray-800/50 rounded-lg", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-300", children: "Select the moods you experience while gaming. This helps us recommend games that match your emotional state." }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: [...types_1.MOODS, ...customMoods].map((mood) => {
                    const userMood = userMoods.find(m => m.id === mood.id);
                    const isSelected = !!userMood;
                    const preference = userMood?.preference || 0;
                    const frequency = userMood?.frequency || 0;
                    const isCustom = customMoods.find(m => m.id === mood.id);
                    return ((0, jsx_runtime_1.jsxs)("div", { className: `
                relative group cursor-pointer transition-all duration-300 transform
                ${isSelected ? 'scale-105' : 'scale-100'}
                ${isSelected ? 'ring-2 ring-gaming-accent' : ''}
              `, onClick: () => handleMoodToggle(mood.id), children: [(0, jsx_runtime_1.jsxs)("div", { className: `
                glass-morphism rounded-lg p-4 border-2 transition-all duration-200
                ${isSelected
                                    ? 'border-gaming-accent bg-gaming-accent/10'
                                    : 'border-gray-700 hover:border-gray-600'}
              `, children: [(0, jsx_runtime_1.jsx)("div", { className: `
                  w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center text-3xl
                  bg-gradient-to-r ${isSelected ? getPreferenceColor(preference) : mood.color}
                `, children: mood.emoji }), (0, jsx_runtime_1.jsxs)("h3", { className: "text-white font-medium text-sm text-center mb-2", children: [mood.name, isCustom && ((0, jsx_runtime_1.jsx)("span", { className: "ml-1 text-xs text-gaming-accent", children: "Custom" }))] }), isSelected && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-3 space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Preference" }), (0, jsx_runtime_1.jsx)("span", { className: `font-medium ${getPreferenceColor(preference).split(' ')[0].replace('from-', 'text-')}`, children: getPreferenceLabel(preference) })] }), (0, jsx_runtime_1.jsx)("input", { type: "range", min: "0", max: "100", step: "10", value: preference, onChange: (e) => {
                                                            e.stopPropagation();
                                                            handlePreferenceChange(mood.id, parseInt(e.target.value));
                                                        }, className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gaming-accent", "aria-label": `Preference level for ${mood.name} mood`, title: `Preference level for ${mood.name} mood`, style: {
                                                            background: `linear-gradient(to right, ${getPreferenceColor(preference).replace('from-', '').replace(' to-', ', ')}) 0%, ${getPreferenceColor(preference).replace('from-', '').replace(' to-', ', ')} ${preference}%, #374151 ${preference}%, #374151 100%)`
                                                        } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Frequency" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-300", children: getFrequencyLabel(frequency) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((level) => ((0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                                                                e.stopPropagation();
                                                                handleFrequencyChange(mood.id, level);
                                                            }, className: `
                          flex-1 h-6 rounded text-xs font-medium transition-colors
                          ${frequency >= level
                                                                ? 'bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white'
                                                                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}
                        `, children: level }, level))) })] })] })), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 right-2", children: isSelected ? ((0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 bg-gaming-accent rounded-full flex items-center justify-center text-white text-xs", children: "\u2713" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 text-xs", children: "+" })) }), isCustom && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: (e) => {
                                                    e.stopPropagation();
                                                    setEditingMood(mood.id);
                                                }, className: "w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs mr-1", children: "\u270F\uFE0F" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: (e) => {
                                                    e.stopPropagation();
                                                    handleRemoveCustomMood(mood.id);
                                                }, className: "w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs", children: "\u00D7" })] }))] }), isSelected && ((0, jsx_runtime_1.jsx)("div", { className: `
              absolute inset-0 rounded-lg bg-gradient-to-r ${getPreferenceColor(preference)}
              opacity-20 blur-xl -z-10
            ` }))] }, mood.id));
                }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-8 border-t border-gray-700 pt-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white", children: "Custom Moods" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setShowAddMood(true), className: "px-4 py-2 bg-gaming-accent text-white rounded-lg hover:opacity-90 transition-opacity", children: "+ Add Custom Mood" })] }), showAddMood && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-white mb-3", children: "Add New Custom Mood" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: newMood.name, onChange: (e) => setNewMood({ ...newMood, name: e.target.value }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", placeholder: "Mood name", "aria-label": "New mood name", title: "Enter name for new custom mood" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newMood.emoji, onChange: (e) => setNewMood({ ...newMood, emoji: e.target.value }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", placeholder: "Emoji", maxLength: 2, "aria-label": "New mood emoji", title: "Enter emoji for new custom mood" }), (0, jsx_runtime_1.jsxs)("select", { value: newMood.color, onChange: (e) => setNewMood({ ...newMood, color: e.target.value }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "from-gray-500 to-gray-600", children: "Gray" }), (0, jsx_runtime_1.jsx)("option", { value: "from-red-500 to-rose-600", children: "Red" }), (0, jsx_runtime_1.jsx)("option", { value: "from-orange-500 to-amber-600", children: "Orange" }), (0, jsx_runtime_1.jsx)("option", { value: "from-yellow-500 to-lime-600", children: "Yellow" }), (0, jsx_runtime_1.jsx)("option", { value: "from-green-500 to-emerald-600", children: "Green" }), (0, jsx_runtime_1.jsx)("option", { value: "from-blue-500 to-indigo-600", children: "Blue" }), (0, jsx_runtime_1.jsx)("option", { value: "from-purple-500 to-pink-600", children: "Purple" }), (0, jsx_runtime_1.jsx)("option", { value: "from-teal-500 to-cyan-600", children: "Teal" })] }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newMood.associatedGenres.join(', '), onChange: (e) => setNewMood({
                                            ...newMood,
                                            associatedGenres: e.target.value.split(',').map(g => g.trim()).filter(g => g)
                                        }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm lg:col-span-3", placeholder: "Associated genres (comma separated)", "aria-label": "Associated genres for new mood", title: "Enter associated genres for new custom mood" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mt-3", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => {
                                            setShowAddMood(false);
                                            setNewMood({ id: '', name: '', emoji: '😊', color: 'from-gray-500 to-gray-600', frequency: 1, preference: 0, associatedGenres: [] });
                                        }, className: "px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handleAddCustomMood, disabled: !newMood.name?.trim(), className: "px-3 py-1 bg-gaming-accent text-white rounded hover:opacity-90 transition-opacity text-sm disabled:opacity-50", children: "Add Mood" })] })] })), editingMood && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-white mb-3", children: "Edit Custom Mood" }), (() => {
                                const mood = customMoods.find(m => m.id === editingMood);
                                if (!mood)
                                    return null;
                                return ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: mood.name, onChange: (e) => handleUpdateCustomMood(mood.id, { name: e.target.value }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", placeholder: "Mood name", "aria-label": `Edit mood name for ${mood.name}`, title: `Edit mood name for ${mood.name}` }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: mood.emoji, onChange: (e) => handleUpdateCustomMood(mood.id, { emoji: e.target.value }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", placeholder: "Emoji", maxLength: 2, "aria-label": `Edit mood emoji for ${mood.name}`, title: `Edit mood emoji for ${mood.name}` }), (0, jsx_runtime_1.jsxs)("select", { value: mood.color, onChange: (e) => handleUpdateCustomMood(mood.id, { color: e.target.value }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "from-gray-500 to-gray-600", children: "Gray" }), (0, jsx_runtime_1.jsx)("option", { value: "from-red-500 to-rose-600", children: "Red" }), (0, jsx_runtime_1.jsx)("option", { value: "from-orange-500 to-amber-600", children: "Orange" }), (0, jsx_runtime_1.jsx)("option", { value: "from-yellow-500 to-lime-600", children: "Yellow" }), (0, jsx_runtime_1.jsx)("option", { value: "from-green-500 to-emerald-600", children: "Green" }), (0, jsx_runtime_1.jsx)("option", { value: "from-blue-500 to-indigo-600", children: "Blue" }), (0, jsx_runtime_1.jsx)("option", { value: "from-purple-500 to-pink-600", children: "Purple" }), (0, jsx_runtime_1.jsx)("option", { value: "from-teal-500 to-cyan-600", children: "Teal" })] }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: mood.associatedGenres.join(', '), onChange: (e) => handleUpdateCustomMood(mood.id, {
                                                associatedGenres: e.target.value.split(',').map(g => g.trim()).filter(Boolean)
                                            }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm lg:col-span-3", placeholder: "Associated genres (comma-separated)", "aria-label": `Edit associated genres for ${mood.name}`, title: `Edit associated genres for ${mood.name}` })] }));
                            })(), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2 mt-3", children: (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setEditingMood(null), className: "px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm", children: "Done" }) })] })), userMoods.length > 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-medium text-white mb-3", children: "Reorder Selected Moods" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: userMoods.map((mood, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 p-3 bg-gray-800/30 rounded-lg", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: mood.emoji }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium flex-1", children: mood.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1", children: [index > 0 && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleReorderMoods(index, index - 1), className: "px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs", children: "\u2191" })), index < userMoods.length - 1 && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleReorderMoods(index, index + 1), className: "px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs", children: "\u2193" }))] })] }, mood.id))) })] }))] }), userMoods.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6 p-4 bg-gray-800/30 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-300 mb-3", children: "Your Mood Profile" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2 mb-3", children: userMoods
                            .sort((a, b) => (b.preference * b.frequency) - (a.preference * a.frequency))
                            .slice(0, 5)
                            .map((mood) => ((0, jsx_runtime_1.jsxs)("span", { className: `
                px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1
                bg-gradient-to-r ${getPreferenceColor(mood.preference)} text-white
              `, children: [(0, jsx_runtime_1.jsx)("span", { children: mood.emoji }), mood.name] }, mood.id))) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: "Most Frequent" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-white font-medium", children: [userMoods.reduce((max, mood) => mood.frequency > max.frequency ? mood : max).emoji, " ", userMoods.reduce((max, mood) => mood.frequency > max.frequency ? mood : max).name] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: "Highest Preference" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-white font-medium", children: [userMoods.reduce((max, mood) => mood.preference > max.preference ? mood : max).emoji, " ", userMoods.reduce((max, mood) => mood.preference > max.preference ? mood : max).name] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: "Avg Preference" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-white font-medium", children: [Math.round(userMoods.reduce((sum, mood) => sum + mood.preference, 0) / userMoods.length), "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: "Total Moods" }), (0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: userMoods.length })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-3", children: "Your mood preferences help us suggest the perfect games for how you're feeling" })] })), userMoods.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "No moods selected yet. Click on moods above to tell us how you like to feel while gaming." }) }))] }));
};
exports.MoodSelector = MoodSelector;
