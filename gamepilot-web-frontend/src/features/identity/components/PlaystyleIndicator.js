"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaystyleIndicatorComponent = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const types_1 = require("../types");
const localStorage_1 = require("../services/localStorage");
const PlaystyleIndicatorComponent = ({ onPlaystyleUpdate }) => {
    const localStorageService = new localStorage_1.LocalStorageService();
    const [playstyle, setPlaystyle] = (0, react_1.useState)(null);
    const [editForm, setEditForm] = (0, react_1.useState)({});
    const [customPlaystyles, setCustomPlaystyles] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [showAddPlaystyle, setShowAddPlaystyle] = (0, react_1.useState)(false);
    const [newPlaystyle, setNewPlaystyle] = (0, react_1.useState)({
        id: '',
        name: '',
        description: '',
        icon: '🎮',
        color: 'from-gray-500 to-gray-600',
        traits: []
    });
    (0, react_1.useEffect)(() => {
        const loadPlaystyle = () => {
            const userPlaystyle = localStorageService.getUserPlaystyle();
            if (userPlaystyle) {
                setPlaystyle(userPlaystyle);
                setEditForm(userPlaystyle);
                setCustomPlaystyles(userPlaystyle.customPlaystyles || []);
            }
            else {
                // Initialize with default data
                const defaultPlaystyle = localStorageService.initializeDefaultData().playstyle;
                setPlaystyle(defaultPlaystyle);
                setEditForm(defaultPlaystyle);
                setCustomPlaystyles(defaultPlaystyle.customPlaystyles || []);
            }
            setIsLoading(false);
        };
        loadPlaystyle();
    }, []);
    const handleSave = () => {
        if (!playstyle)
            return;
        const updatedPlaystyle = {
            ...playstyle,
            ...editForm,
            preferences: { ...playstyle.preferences, ...editForm.preferences },
            customPlaystyles
        };
        localStorageService.setUserPlaystyle(updatedPlaystyle);
        setPlaystyle(updatedPlaystyle);
        setShowAddPlaystyle(false);
        onPlaystyleUpdate?.(updatedPlaystyle);
    };
    const handleReset = () => {
        const defaultPlaystyle = localStorageService.initializeDefaultData().playstyle;
        setEditForm(defaultPlaystyle);
        localStorageService.setUserPlaystyle(defaultPlaystyle);
    };
    const handlePrimaryPlaystyleChange = (playstyleId) => {
        const allPlaystyles = [...types_1.PLAYSTYLES, ...customPlaystyles];
        const selectedPlaystyle = allPlaystyles.find(p => p.id === playstyleId);
        if (selectedPlaystyle) {
            setEditForm(prev => ({
                ...prev,
                primary: selectedPlaystyle
            }));
        }
    };
    const handleSecondaryPlaystyleChange = (playstyleId) => {
        if (playstyleId === 'none') {
            setEditForm(prev => ({
                ...prev,
                secondary: undefined
            }));
        }
        else {
            const allPlaystyles = [...types_1.PLAYSTYLES, ...customPlaystyles];
            const selectedPlaystyle = allPlaystyles.find(p => p.id === playstyleId);
            if (selectedPlaystyle) {
                setEditForm(prev => ({
                    ...prev,
                    secondary: selectedPlaystyle
                }));
            }
        }
    };
    const handleAddCustomPlaystyle = () => {
        if (!newPlaystyle.name?.trim())
            return;
        const customPlaystyle = {
            id: `custom-${Date.now()}`,
            name: newPlaystyle.name.trim(),
            description: newPlaystyle.description || '',
            icon: newPlaystyle.icon || '🎮',
            color: newPlaystyle.color || 'from-gray-500 to-gray-600',
            traits: newPlaystyle.traits || []
        };
        const updatedCustomPlaystyles = [...customPlaystyles, customPlaystyle];
        setCustomPlaystyles(updatedCustomPlaystyles);
        setNewPlaystyle({
            id: '',
            name: '',
            description: '',
            icon: '🎮',
            color: 'from-gray-500 to-gray-600',
            traits: []
        });
        setShowAddPlaystyle(false);
    };
    const handlePreferenceChange = (key, value) => {
        setEditForm((prev) => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [key]: value
            }
        }));
    };
    const handleRemoveCustomPlaystyle = (playstyleId) => {
        const updatedCustomPlaystyles = customPlaystyles.filter(ps => ps.id !== playstyleId);
        setCustomPlaystyles(updatedCustomPlaystyles);
    };
    const handleTraitToggle = (trait) => {
        const currentTraits = editForm.traits || playstyle?.traits || [];
        const updatedTraits = currentTraits.includes(trait)
            ? currentTraits.filter((t) => t !== trait)
            : [...currentTraits, trait];
        setEditForm((prev) => ({
            ...prev,
            traits: updatedTraits
        }));
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-xl mx-auto mb-4 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\uD83C\uDFAF" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Loading playstyle..." })] }));
    }
    if (!playstyle) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-xl mx-auto mb-4 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: "\u26A0\uFE0F" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Unable to load playstyle" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-6 cinematic-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-semibold text-white flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAF" }), "Playstyle Profile"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleReset, className: "px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors", title: "Reset playstyle to default", "aria-label": "Reset playstyle to default", children: "Reset to Default" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSave, className: "px-4 py-2 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-lg hover:opacity-90 transition-opacity", title: "Save playstyle changes", "aria-label": "Save playstyle changes", children: "Save Changes" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: "Primary Playstyle" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-3", children: [...types_1.PLAYSTYLES, ...customPlaystyles].map((style) => {
                                    const isCustom = customPlaystyles.find(ps => ps.id === style.id);
                                    return ((0, jsx_runtime_1.jsxs)("button", { onClick: () => handlePrimaryPlaystyleChange(style.id), className: `
                    relative group cursor-pointer transition-all duration-300 transform
                    ${editForm.primary?.id === style.id
                                            ? 'scale-105 ring-2 ring-gaming-accent'
                                            : 'scale-100 hover:scale-102'}
                  `, title: `Select ${style.name} as primary playstyle`, "aria-label": `Select ${style.name} as primary playstyle`, children: [isCustom && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 right-2", children: (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: (e) => {
                                                        e.stopPropagation();
                                                        handleRemoveCustomPlaystyle(style.id);
                                                    }, className: "w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-700", title: `Remove custom playstyle ${style.name}`, "aria-label": `Remove custom playstyle ${style.name}`, children: "\u00D7" }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: `
                      w-10 h-10 rounded-lg flex items-center justify-center text-xl
                      bg-gradient-to-r ${style.color}
                    `, children: style.icon }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white font-medium", children: [style.name, isCustom && ((0, jsx_runtime_1.jsx)("span", { className: "ml-1 text-xs text-gaming-accent", children: "Custom" }))] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400", children: style.description })] }, style.id));
                                }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: "Secondary Playstyle (Optional)" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleSecondaryPlaystyleChange('none'), className: `
                w-full p-3 rounded-lg border-2 transition-all duration-200 text-left
                ${!editForm.secondary
                                            ? 'border-gaming-accent bg-gaming-accent/10'
                                            : 'border-gray-700 hover:border-gray-600'}
              `, title: "Select no secondary playstyle", "aria-label": "Select no secondary playstyle", children: (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "No secondary playstyle" }) }), [...types_1.PLAYSTYLES, ...customPlaystyles]
                                        .filter(style => style.id !== editForm.primary?.id)
                                        .map((style) => {
                                        const isCustom = customPlaystyles.find(ps => ps.id === style.id);
                                        return ((0, jsx_runtime_1.jsxs)("button", { onClick: () => handleSecondaryPlaystyleChange(style.id), className: `
                      w-full p-3 rounded-lg border-2 transition-all duration-200 text-left relative
                      ${editForm.secondary?.id === style.id
                                                ? 'border-gaming-accent bg-gaming-accent/10'
                                                : 'border-gray-700 hover:border-gray-600'}
                    `, title: `Select ${style.name} as secondary playstyle`, "aria-label": `Select ${style.name} as secondary playstyle`, children: [isCustom && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 right-2", children: (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: (e) => {
                                                            e.stopPropagation();
                                                            handleRemoveCustomPlaystyle(style.id);
                                                        }, className: "w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-700", title: `Remove custom playstyle ${style.name}`, "aria-label": `Remove custom playstyle ${style.name}`, children: "\u00D7" }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: `
                        w-8 h-8 rounded-lg flex items-center justify-center text-sm
                        bg-gradient-to-r ${style.color}
                      `, children: style.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-white font-medium", children: [style.name, isCustom && ((0, jsx_runtime_1.jsx)("span", { className: "ml-1 text-xs text-gaming-accent", children: "Custom" }))] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400", children: style.description })] })] })] }, style.id));
                                    })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-8 space-y-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: "Gaming Preferences" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Session Length" }), (0, jsx_runtime_1.jsxs)("select", { value: editForm.preferences?.sessionLength || 'medium', onChange: (e) => handlePreferenceChange('sessionLength', e.target.value), className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gaming-accent focus:outline-none", children: [(0, jsx_runtime_1.jsx)("option", { value: "short", children: "\u26A1 Short (0-30 min)" }), (0, jsx_runtime_1.jsx)("option", { value: "medium", children: "\u23F1\uFE0F Medium (30-90 min)" }), (0, jsx_runtime_1.jsx)("option", { value: "long", children: "\uD83D\uDD50 Long (90+ min)" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Difficulty Preference" }), (0, jsx_runtime_1.jsxs)("select", { value: editForm.preferences?.difficulty || 'normal', onChange: (e) => handlePreferenceChange('difficulty', e.target.value), className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gaming-accent focus:outline-none", children: [(0, jsx_runtime_1.jsx)("option", { value: "casual", children: "\uD83D\uDE0C Casual" }), (0, jsx_runtime_1.jsx)("option", { value: "normal", children: "\uD83C\uDFAF Normal" }), (0, jsx_runtime_1.jsx)("option", { value: "hard", children: "\uD83D\uDCAA Hard" }), (0, jsx_runtime_1.jsx)("option", { value: "expert", children: "\uD83D\uDD25 Expert" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Social Preference" }), (0, jsx_runtime_1.jsxs)("select", { value: editForm.preferences?.socialPreference || 'solo', onChange: (e) => handlePreferenceChange('socialPreference', e.target.value), className: "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-gaming-accent focus:outline-none", children: [(0, jsx_runtime_1.jsx)("option", { value: "solo", children: "\uD83D\uDC64 Solo" }), (0, jsx_runtime_1.jsx)("option", { value: "cooperative", children: "\uD83E\uDD1D Cooperative" }), (0, jsx_runtime_1.jsx)("option", { value: "competitive", children: "\u2694\uFE0F Competitive" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-md font-medium text-gray-300", children: "Focus Areas" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm text-gray-300", children: "Story Focus" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-white", children: [editForm.preferences?.storyFocus || 70, "%"] })] }), (0, jsx_runtime_1.jsx)("input", { type: "range", min: "0", max: "100", value: editForm.preferences?.storyFocus || 70, onChange: (e) => handlePreferenceChange('storyFocus', parseInt(e.target.value)), className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gaming-accent" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm text-gray-300", children: "Graphics Focus" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-white", children: [editForm.preferences?.graphicsFocus || 60, "%"] })] }), (0, jsx_runtime_1.jsx)("input", { type: "range", min: "0", max: "100", value: editForm.preferences?.graphicsFocus || 60, onChange: (e) => handlePreferenceChange('graphicsFocus', parseInt(e.target.value)), className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gaming-accent" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm text-gray-300", children: "Gameplay Focus" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-white", children: [editForm.preferences?.gameplayFocus || 80, "%"] })] }), (0, jsx_runtime_1.jsx)("input", { type: "range", min: "0", max: "100", value: editForm.preferences?.gameplayFocus || 80, onChange: (e) => handlePreferenceChange('gameplayFocus', parseInt(e.target.value)), className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gaming-accent" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-md font-medium text-gray-300 mb-3", children: "Personality Traits" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-2", children: [editForm.primary?.traits?.map((trait) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => handleTraitToggle(trait), className: `
                  px-3 py-1 rounded-full text-sm transition-all duration-200
                  ${(editForm.traits || []).includes(trait)
                                            ? 'bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white'
                                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}
                `, children: trait }, trait))), editForm.secondary?.traits?.map((trait) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => handleTraitToggle(trait), className: `
                  px-3 py-1 rounded-full text-sm transition-all duration-200
                  ${(editForm.traits || []).includes(trait)
                                            ? 'bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white'
                                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}
                `, children: trait }, trait)))] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-2", children: "Select traits that describe your gaming personality" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-8 p-4 bg-gray-800/30 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-300 mb-3", children: "Your Playstyle Profile" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: `
              w-10 h-10 rounded-lg flex items-center justify-center
              bg-gradient-to-r ${editForm.primary?.color}
            `, children: editForm.primary?.icon }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: editForm.primary?.name })] }), editForm.secondary && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-500", children: "+" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: `
                  w-10 h-10 rounded-lg flex items-center justify-center
                  bg-gradient-to-r ${editForm.secondary.color}
                `, children: editForm.secondary.icon }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: editForm.secondary.name })] })] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: (editForm.traits || []).map((trait) => ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-gaming-primary/20 text-gaming-primary rounded text-xs", children: trait }, trait))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-8 border-t border-gray-700 pt-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white", children: "Custom Playstyles" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setShowAddPlaystyle(true), className: "px-4 py-2 bg-gaming-accent text-white rounded-lg hover:opacity-90 transition-opacity", children: "+ Add Custom Playstyle" })] }), showAddPlaystyle && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-white mb-3", children: "Add New Custom Playstyle" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: newPlaystyle.name, onChange: (e) => setNewPlaystyle({ ...newPlaystyle, name: e.target.value }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", placeholder: "Playstyle name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newPlaystyle.description, onChange: (e) => setNewPlaystyle({ ...newPlaystyle, description: e.target.value }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", placeholder: "Description" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newPlaystyle.icon, onChange: (e) => setNewPlaystyle({ ...newPlaystyle, icon: e.target.value }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", placeholder: "Emoji", maxLength: 2 }), (0, jsx_runtime_1.jsxs)("select", { value: newPlaystyle.color, onChange: (e) => setNewPlaystyle({ ...newPlaystyle, color: e.target.value }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "from-gray-500 to-gray-600", children: "Gray" }), (0, jsx_runtime_1.jsx)("option", { value: "from-red-500 to-rose-600", children: "Red" }), (0, jsx_runtime_1.jsx)("option", { value: "from-orange-500 to-amber-600", children: "Orange" }), (0, jsx_runtime_1.jsx)("option", { value: "from-yellow-500 to-lime-600", children: "Yellow" }), (0, jsx_runtime_1.jsx)("option", { value: "from-green-500 to-emerald-600", children: "Green" }), (0, jsx_runtime_1.jsx)("option", { value: "from-blue-500 to-indigo-600", children: "Blue" }), (0, jsx_runtime_1.jsx)("option", { value: "from-purple-500 to-pink-600", children: "Purple" }), (0, jsx_runtime_1.jsx)("option", { value: "from-teal-500 to-cyan-600", children: "Teal" })] }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newPlaystyle.traits?.join(', ') || '', onChange: (e) => setNewPlaystyle({
                                            ...newPlaystyle,
                                            traits: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                        }), className: "px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm md:col-span-2", placeholder: "Traits (comma-separated)" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mt-3", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => {
                                            setShowAddPlaystyle(false);
                                            setNewPlaystyle({
                                                id: '',
                                                name: '',
                                                description: '',
                                                icon: '🎮',
                                                color: 'from-gray-500 to-gray-600',
                                                traits: []
                                            });
                                        }, className: "px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handleAddCustomPlaystyle, disabled: !newPlaystyle.name?.trim(), className: "px-3 py-1 bg-gaming-accent text-white rounded hover:opacity-90 transition-opacity text-sm disabled:opacity-50", children: "Add Playstyle" })] })] })), customPlaystyles.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-medium text-white mb-3", children: "Your Custom Playstyles" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: customPlaystyles.map((playstyle) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: `
                    w-10 h-10 rounded-lg flex items-center justify-center
                    bg-gradient-to-r ${playstyle.color}
                  `, children: playstyle.icon }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: playstyle.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400", children: playstyle.description })] }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => {
                                                // Edit functionality can be implemented later
                                            }, className: "px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs", children: "Edit" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleRemoveCustomPlaystyle(playstyle.id), className: "px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs", children: "Delete" })] }, playstyle.id))) })] }))] })] }));
};
exports.PlaystyleIndicatorComponent = PlaystyleIndicatorComponent;
