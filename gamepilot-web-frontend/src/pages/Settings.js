"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const ThemeToggle_1 = require("../components/ThemeToggle");
const EmulatorConfig_1 = require("../components/EmulatorConfig");
const emulatorLauncher_1 = require("../services/emulatorLauncher");
const integrationsStore_1 = require("../features/integrations/integrationsStore");
const customisationStore_1 = require("../features/customisation/customisationStore");
const authStore_1 = require("../store/authStore");
const persona_1 = require("../hooks/persona");
const useMoodRecommendations_1 = require("../hooks/useMoodRecommendations");
const useLibraryStore_1 = require("../stores/useLibraryStore");
const Settings = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    // Tab state
    const [activeTab, setActiveTab] = (0, react_1.useState)('general');
    // Get persona and mood data
    const persona = (0, persona_1.useLibraryPersona)();
    const { games } = (0, useLibraryStore_1.useLibraryStore)();
    const { primaryMoodInfo, hasRecommendations } = (0, useMoodRecommendations_1.useMoodRecommendations)({ games });
    // Use customisation store for appearance settings
    const customisation = (0, customisationStore_1.useCustomisation)();
    const { setGlobalSettings } = (0, customisationStore_1.useCustomisationActions)();
    // Use integrations store
    const integrations = (0, integrationsStore_1.useIntegrations)();
    const { loadIntegrationsFromServer, syncIntegrationsToServer, setIntegration, connectSteam, disconnectSteam, connectDiscord, disconnectDiscord } = (0, integrationsStore_1.useIntegrationsActions)();
    // Auth store - single source of truth for user data
    const { user, isAuthenticated, isLoading: authLoading, updateProfile: updateAuthProfile } = (0, authStore_1.useAuthStore)();
    // Local state for settings (non-profile related)
    const [general, setGeneral] = (0, react_1.useState)({
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        autoSync: true,
        syncInterval: 30
    });
    // Profile editing state with validation
    const [isEditingProfile, setIsEditingProfile] = (0, react_1.useState)(false);
    const [isSavingProfile, setIsSavingProfile] = (0, react_1.useState)(false);
    const [profileForm, setProfileForm] = (0, react_1.useState)({
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || '',
        location: user?.location || '',
        website: user?.website || '',
        birthday: user?.birthday || '',
        discordTag: user?.discordTag || '',
        steamProfile: user?.steamProfile || ''
    });
    const [profileErrors, setProfileErrors] = (0, react_1.useState)({});
    // Birthday celebration state
    const [showBirthdayCelebration, setShowBirthdayCelebration] = (0, react_1.useState)(false);
    const [apiKeys, setApiKeys] = (0, react_1.useState)({
        youtubeApiKey: import.meta.env.VITE_YOUTUBE_API_KEY || '',
        discordBotToken: import.meta.env.VITE_DISCORD_BOT_TOKEN || '',
        discordUserToken: import.meta.env.VITE_DISCORD_USER_TOKEN || '',
        steamApiKey: import.meta.env.VITE_STEAM_API_KEY || ''
    });
    const [notifications, setNotifications] = (0, react_1.useState)({
        achievements: true,
        friendActivity: true,
        gameUpdates: false,
        news: false,
        discordMessages: true,
        youtubeNotifications: false
    });
    const [privacy, setPrivacy] = (0, react_1.useState)({
        profilePublic: true,
        showPlaytime: true,
        shareAchievements: false,
        dataCollection: true,
        analyticsEnabled: true
    });
    const [emulators, setEmulators] = (0, react_1.useState)([]);
    const [showEmulatorConfig, setShowEmulatorConfig] = (0, react_1.useState)(false);
    const [testingApiKey, setTestingApiKey] = (0, react_1.useState)('');
    // Load integrations from server on mount
    (0, react_1.useEffect)(() => {
        loadIntegrationsFromServer();
    }, [loadIntegrationsFromServer]);
    // Check for birthday on component mount
    (0, react_1.useEffect)(() => {
        const checkBirthday = () => {
            if (!user?.birthday)
                return;
            const today = new Date();
            const birthday = new Date(user.birthday);
            // Check if today is the user's birthday
            if (today.getMonth() === birthday.getMonth() && today.getDate() === birthday.getDate()) {
                setShowBirthdayCelebration(true);
                // Auto-hide celebration after 10 seconds
                setTimeout(() => {
                    setShowBirthdayCelebration(false);
                }, 10000);
            }
        };
        checkBirthday();
    }, [user?.birthday]);
    // Initialize emulator launcher with saved configs
    (0, react_1.useEffect)(() => {
        if (emulators.length > 0) {
            emulatorLauncher_1.emulatorLauncher.setConfigs(emulators);
        }
    }, [emulators]);
    const updateIntegration = async (platform, enabled) => {
        try {
            if (platform === 'steam' && enabled) {
                await connectSteam();
            }
            else if (platform === 'steam' && !enabled) {
                await disconnectSteam();
            }
            else if (platform === 'discord' && enabled) {
                await connectDiscord();
            }
            else if (platform === 'discord' && !enabled) {
                await disconnectDiscord();
            }
            else if (platform === 'youtube' && enabled) {
                // Connect YouTube integration
                setIntegration('youtubeConnected', true);
                console.log('🎬 YouTube integration enabled!');
                alert('🎬 YouTube integration enabled!\n\nYou can now access YouTube gaming content and recommendations.');
            }
            else if (platform === 'youtube' && !enabled) {
                // Disconnect YouTube integration
                setIntegration('youtubeConnected', false);
                console.log('📺 YouTube integration disabled!');
                alert('📺 YouTube integration disabled.\n\nYou can re-enable it anytime from the Integrations page.');
            }
            else if (platform === 'gog' && enabled) {
                window.open('https://gog.com', '_blank');
                alert('🎯 GOG integration coming soon!\n\nGOG opened in a new tab.');
            }
            else if (platform === 'epic' && enabled) {
                window.open('https://epicgames.com', '_blank');
                alert('🚀 Epic Games integration coming soon!\n\nEpic Games opened in a new tab.');
            }
            await syncIntegrationsToServer();
        }
        catch (error) {
            console.error(`Failed to ${enabled ? 'connect' : 'disconnect'} ${platform}:`, error);
        }
    };
    const updateGeneral = (key, value) => {
        setGeneral(prev => ({ ...prev, [key]: value }));
    };
    const updateNotification = (type, enabled) => {
        setNotifications(prev => ({ ...prev, [type]: enabled }));
    };
    const updatePrivacy = (setting, enabled) => {
        setPrivacy(prev => ({ ...prev, [setting]: enabled }));
    };
    const updateApiKey = (key, value) => {
        setApiKeys(prev => ({ ...prev, [key]: value }));
    };
    const updateProfile = (field, value) => {
        setProfileForm(prev => ({ ...prev, [field]: value }));
    };
    const saveProfile = async () => {
        if (!isAuthenticated || !user) {
            // Show error message for non-authenticated users
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse';
            notification.textContent = '❌ Profile editing requires an account. Please login first.';
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.remove();
            }, 5000);
            return;
        }
        // Validate form
        const errors = {};
        if (!profileForm.username?.trim()) {
            errors.username = 'Username is required';
        }
        else if (profileForm.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        }
        if (!profileForm.email?.trim()) {
            errors.email = 'Email is required';
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
            errors.email = 'Please enter a valid email address';
        }
        if (profileForm.discordTag && !/^.{3,32}#\d{4}$/.test(profileForm.discordTag)) {
            errors.discordTag = 'Discord tag must be in format: Username#1234';
        }
        if (profileForm.website && !/^https?:\/\/.+/.test(profileForm.website)) {
            errors.website = 'Website must start with http:// or https://';
        }
        if (Object.keys(errors).length > 0) {
            setProfileErrors(errors);
            return;
        }
        try {
            setIsSavingProfile(true);
            setProfileErrors({});
            // Update profile via auth store
            await updateAuthProfile(profileForm);
            setIsEditingProfile(false);
            // Show success message with animation
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
            notification.innerHTML = '✅ Profile updated successfully!';
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.classList.add('animate-pulse');
                setTimeout(() => {
                    notification.remove();
                }, 2000);
            }, 1000);
        }
        catch (error) {
            console.error('Failed to update profile:', error);
            // Show error message with animation
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-shake';
            notification.innerHTML = '❌ Failed to update profile. Please try again.';
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.remove();
            }, 5000);
        }
        finally {
            setIsSavingProfile(false);
        }
    };
    const cancelEditProfile = () => {
        // Reset form to current user data
        setProfileForm({
            username: user?.username || '',
            email: user?.email || '',
            bio: user?.bio || '',
            location: user?.location || '',
            website: user?.website || '',
            birthday: user?.birthday || '',
            discordTag: user?.discordTag || '',
            steamProfile: user?.steamProfile || ''
        });
        setIsEditingProfile(false);
    };
    const testApiKey = async (platform) => {
        setTestingApiKey(platform);
        // Simulate API key testing
        setTimeout(() => {
            const isValid = platform === 'youtube' && apiKeys.youtubeApiKey.length > 10;
            if (isValid) {
                alert(`✅ ${platform} API key is valid!`);
            }
            else {
                alert(`❌ ${platform} API key appears to be invalid or missing.`);
            }
            setTestingApiKey('');
        }, 1500);
    };
    const handleEmulatorConfigSave = (configs) => {
        setEmulators(configs);
        emulatorLauncher_1.emulatorLauncher.setConfigs(configs);
    };
    const openEmulatorConfig = () => {
        setShowEmulatorConfig(true);
    };
    const closeEmulatorConfig = () => {
        setShowEmulatorConfig(false);
    };
    const tabs = [
        { id: 'general', label: '⚙️ General', icon: '⚙️' },
        { id: 'mood-persona', label: '🎭 Mood & Persona', icon: '🎭' },
        { id: 'integrations', label: '🔗 Integrations', icon: '🔗' },
        { id: 'api-keys', label: '🔑 API Keys', icon: '🔑' },
        { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
        { id: 'privacy', label: '🔒 Privacy', icon: '🔒' },
        { id: 'emulators', label: '🎮 Emulators', icon: '🎮' },
        { id: 'account', label: '👤 Account', icon: '👤' }
    ];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 py-8", children: [(0, jsx_runtime_1.jsx)("header", { className: "mb-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-5xl font-gaming bg-gradient-to-r from-gaming-primary to-gaming-secondary bg-clip-text text-transparent mb-2", children: "Settings" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 text-lg", children: "Customize your GamePilot experience" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: "Theme:" }), (0, jsx_runtime_1.jsx)(ThemeToggle_1.ThemeToggle, { size: "sm" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: "Layout:" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2", children: ['compact', 'comfortable'].map((density) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setGlobalSettings({ density }), className: `px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${customisation.density === density
                                                                ? 'bg-gaming-primary text-white'
                                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`, children: [density === 'compact' && '📱', density === 'comfortable' && '🖥️', density.charAt(0).toUpperCase() + density.slice(1)] }, density))) })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => navigate('/customisation'), className: "px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFA8" }), (0, jsx_runtime_1.jsx)("span", { children: "Customisation" })] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap justify-center gap-2 mb-8", children: tabs.map((tab) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab(tab.id), className: `px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-gaming-primary text-white shadow-lg shadow-gaming-primary/25'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`, children: tab.label }, tab.id))) }), (0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto", children: [activeTab === 'account' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [!isAuthenticated && ((0, jsx_runtime_1.jsx)("div", { className: "glass-morphism rounded-xl p-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83D\uDD12" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-white mb-4", children: "Authentication Required" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-6", children: "Please login to access and manage your account settings." }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/login'), className: "px-6 py-3 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 transition-colors font-medium", children: "Login to Account" })] }) })), isAuthenticated && user && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative group", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32 h-32 rounded-full bg-gradient-to-br from-gaming-primary to-gaming-secondary flex items-center justify-center text-4xl text-white font-bold shadow-2xl", children: user?.username?.charAt(0).toUpperCase() || 'G' }), (0, jsx_runtime_1.jsx)("button", { className: "absolute bottom-0 right-0 w-10 h-10 bg-gaming-primary rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg", children: (0, jsx_runtime_1.jsxs)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" }), (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z" })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold text-white mb-2", children: user?.username || 'Guest' }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-lg mb-1", children: user?.email || 'No email' }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300 italic", children: ["\"", user?.bio || 'No bio set', "\""] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mt-3 text-sm text-gray-400", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["\uD83C\uDFAE Member since ", new Date(user?.createdAt || '').toLocaleDateString()] }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsxs)("span", { children: ["\uD83D\uDD50 Last active ", new Date(user?.lastActive || '').toLocaleDateString()] })] })] })] }), !isEditingProfile && ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsEditingProfile(true), className: "px-6 py-3 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 transition-colors font-medium flex items-center gap-2 shadow-lg", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }), "Edit Profile"] }))] }), isEditingProfile && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6 pt-6 border-t border-gray-700", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-white mb-4", children: "Edit Profile Information" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-gray-400 text-sm mb-1 block", children: "Username" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: profileForm.username, onChange: (e) => {
                                                                                        updateProfile('username', e.target.value);
                                                                                        setProfileErrors(prev => {
                                                                                            const newErrors = { ...prev };
                                                                                            delete newErrors.username;
                                                                                            return newErrors;
                                                                                        });
                                                                                    }, className: `w-full px-4 py-2 bg-gray-800 text-white rounded-lg border focus:outline-none transition-colors ${profileErrors.username
                                                                                        ? 'border-red-500 focus:border-red-600'
                                                                                        : 'border-gray-700 focus:border-gaming-primary'}`, placeholder: "Enter username" }), profileErrors.username && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm mt-1", children: profileErrors.username }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-gray-400 text-sm mb-1 block", children: "Email" }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: profileForm.email, onChange: (e) => {
                                                                                        updateProfile('email', e.target.value);
                                                                                        setProfileErrors(prev => {
                                                                                            const newErrors = { ...prev };
                                                                                            delete newErrors.email;
                                                                                            return newErrors;
                                                                                        });
                                                                                    }, className: `w-full px-4 py-2 bg-gray-800 text-white rounded-lg border focus:outline-none transition-colors ${profileErrors.email
                                                                                        ? 'border-red-500 focus:border-red-600'
                                                                                        : 'border-gray-700 focus:border-gaming-primary'}`, placeholder: "Enter email address" }), profileErrors.email && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm mt-1", children: profileErrors.email }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-gray-400 text-sm mb-1 block", children: "Bio" }), (0, jsx_runtime_1.jsx)("textarea", { value: profileForm.bio, onChange: (e) => updateProfile('bio', e.target.value), rows: 3, placeholder: "Tell us about your gaming journey...", className: "w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-gaming-primary focus:outline-none resize-none transition-colors" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-gray-400 text-sm mb-1 block", children: "Location" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: profileForm.location, onChange: (e) => updateProfile('location', e.target.value), placeholder: "City, Country", className: "w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-gaming-primary focus:outline-none transition-colors" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-gray-400 text-sm mb-1 block", children: "Website" }), (0, jsx_runtime_1.jsx)("input", { type: "url", value: profileForm.website, onChange: (e) => {
                                                                                        updateProfile('website', e.target.value);
                                                                                        setProfileErrors(prev => {
                                                                                            const newErrors = { ...prev };
                                                                                            delete newErrors.website;
                                                                                            return newErrors;
                                                                                        });
                                                                                    }, placeholder: "https://yourwebsite.com", className: `w-full px-4 py-2 bg-gray-800 text-white rounded-lg border focus:outline-none transition-colors ${profileErrors.website
                                                                                        ? 'border-red-500 focus:border-red-600'
                                                                                        : 'border-gray-700 focus:border-gaming-primary'}` }), profileErrors.website && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm mt-1", children: profileErrors.website }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-gray-400 text-sm mb-1 block", children: "Birthday" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: profileForm.birthday, onChange: (e) => updateProfile('birthday', e.target.value), className: "w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-gaming-primary focus:outline-none transition-colors" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-gray-400 text-sm mb-1 block", children: "Discord Tag" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: profileForm.discordTag, onChange: (e) => {
                                                                                        updateProfile('discordTag', e.target.value);
                                                                                        setProfileErrors(prev => {
                                                                                            const newErrors = { ...prev };
                                                                                            delete newErrors.discordTag;
                                                                                            return newErrors;
                                                                                        });
                                                                                    }, placeholder: "Username#1234", className: `w-full px-4 py-2 bg-gray-800 text-white rounded-lg border focus:outline-none transition-colors ${profileErrors.discordTag
                                                                                        ? 'border-red-500 focus:border-red-600'
                                                                                        : 'border-gray-700 focus:border-gaming-primary'}` }), profileErrors.discordTag && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm mt-1", children: profileErrors.discordTag }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-gray-400 text-sm mb-1 block", children: "Steam Profile" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: profileForm.steamProfile, onChange: (e) => updateProfile('steamProfile', e.target.value), placeholder: "SteamID64 or custom URL", className: "w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-gaming-primary focus:outline-none transition-colors" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mt-6", children: [(0, jsx_runtime_1.jsx)("button", { onClick: saveProfile, disabled: isSavingProfile, className: "px-6 py-3 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed", children: isSavingProfile ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("svg", { className: "animate-spin -ml-1 mr-3 h-4 w-4 text-white", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Saving..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "Save Changes"] })) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsEditingProfile(false), className: "px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium", children: "Cancel" })] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xl font-bold text-white mb-6 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDCCA" }), " Gaming Statistics"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-gaming-primary mb-1", children: user?.gamingProfile?.gamesPlayed || 0 }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: "Games Played" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-gaming-secondary mb-1", children: user?.gamingProfile?.gamesCompleted || 0 }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: "Completed" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-3xl font-bold text-green-400 mb-1", children: [Math.floor((user?.gamingProfile?.totalPlaytime || 0) / 60), "h"] }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: "Playtime" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-yellow-400 mb-1", children: user?.gamingProfile?.achievementsCount || 0 }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: "Achievements" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xl font-bold text-white mb-6 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDD17" }), " Connected Accounts"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-white font-bold", children: "S" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: "Steam" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: user?.steamProfile ? `Connected: ${user.steamProfile}` : 'Not connected' })] })] }), (0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm", children: user?.steamProfile ? 'Disconnect' : 'Connect' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-white font-bold", children: "D" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: "Discord" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm", children: user?.discordTag ? `Connected: ${user.discordTag}` : 'Not connected' })] })] }), (0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm", children: user?.discordTag ? 'Disconnect' : 'Connect' })] })] })] })] }))] })), activeTab === 'general' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\u2699\uFE0F" }), "General Settings"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "language-select", className: "text-white text-lg font-medium mb-3 block", children: "Language" }), (0, jsx_runtime_1.jsxs)("select", { id: "language-select", value: general.language, onChange: (e) => updateGeneral('language', e.target.value), className: "w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-gaming-primary focus:outline-none", children: [(0, jsx_runtime_1.jsx)("option", { value: "en", children: "English" }), (0, jsx_runtime_1.jsx)("option", { value: "es", children: "Espa\u00F1ol" }), (0, jsx_runtime_1.jsx)("option", { value: "fr", children: "Fran\u00E7ais" }), (0, jsx_runtime_1.jsx)("option", { value: "de", children: "Deutsch" }), (0, jsx_runtime_1.jsx)("option", { value: "ja", children: "\u65E5\u672C\u8A9E" }), (0, jsx_runtime_1.jsx)("option", { value: "zh", children: "\u4E2D\u6587" }), (0, jsx_runtime_1.jsx)("option", { value: "ko", children: "\uD55C\uAD6D\uC5B4" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm mt-2", children: "Choose your preferred language for the interface" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "timezone-select", className: "text-white text-lg font-medium mb-3 block", children: "Timezone" }), (0, jsx_runtime_1.jsxs)("select", { id: "timezone-select", value: general.timezone, onChange: (e) => updateGeneral('timezone', e.target.value), className: "w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-gaming-primary focus:outline-none", children: [(0, jsx_runtime_1.jsx)("option", { value: "UTC", children: "UTC" }), (0, jsx_runtime_1.jsx)("option", { value: "EST", children: "Eastern Time (UTC-5)" }), (0, jsx_runtime_1.jsx)("option", { value: "PST", children: "Pacific Time (UTC-8)" }), (0, jsx_runtime_1.jsx)("option", { value: "CST", children: "Central Time (UTC-6)" }), (0, jsx_runtime_1.jsx)("option", { value: "MST", children: "Mountain Time (UTC-7)" }), (0, jsx_runtime_1.jsx)("option", { value: "GMT", children: "Greenwich Mean Time" }), (0, jsx_runtime_1.jsx)("option", { value: "CET", children: "Central European Time" }), (0, jsx_runtime_1.jsx)("option", { value: "JST", children: "Japan Standard Time" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm mt-2", children: "Set your local timezone for accurate timestamps" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "date-format-select", className: "text-white text-lg font-medium mb-3 block", children: "Date Format" }), (0, jsx_runtime_1.jsxs)("select", { id: "date-format-select", value: general.dateFormat, onChange: (e) => updateGeneral('dateFormat', e.target.value), className: "w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-gaming-primary focus:outline-none", children: [(0, jsx_runtime_1.jsx)("option", { value: "MM/DD/YYYY", children: "MM/DD/YYYY" }), (0, jsx_runtime_1.jsx)("option", { value: "DD/MM/YYYY", children: "DD/MM/YYYY" }), (0, jsx_runtime_1.jsx)("option", { value: "YYYY-MM-DD", children: "YYYY-MM-DD" }), (0, jsx_runtime_1.jsx)("option", { value: "DD.MM.YYYY", children: "DD.MM.YYYY" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm mt-2", children: "Preferred date display format" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white text-lg font-medium", children: "Auto Sync" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: "Automatically sync data with connected platforms" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => updateGeneral('autoSync', !general.autoSync), "aria-label": `Toggle auto sync ${general.autoSync ? 'off' : 'on'}`, className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${general.autoSync ? 'bg-gaming-accent' : 'bg-gray-600'}`, children: (0, jsx_runtime_1.jsx)("span", { className: `inline-block h-4 w-4 rounded-full bg-white transition-transform ${general.autoSync ? 'translate-x-6' : 'translate-x-1'}` }) })] }), general.autoSync && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "sync-interval-select", className: "text-white text-lg font-medium mb-3 block", children: "Sync Interval" }), (0, jsx_runtime_1.jsxs)("select", { id: "sync-interval-select", value: general.syncInterval, onChange: (e) => updateGeneral('syncInterval', parseInt(e.target.value)), className: "w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-gaming-primary focus:outline-none", children: [(0, jsx_runtime_1.jsx)("option", { value: 15, children: "15 minutes" }), (0, jsx_runtime_1.jsx)("option", { value: 30, children: "30 minutes" }), (0, jsx_runtime_1.jsx)("option", { value: 60, children: "1 hour" }), (0, jsx_runtime_1.jsx)("option", { value: 180, children: "3 hours" }), (0, jsx_runtime_1.jsx)("option", { value: 360, children: "6 hours" }), (0, jsx_runtime_1.jsx)("option", { value: 720, children: "12 hours" }), (0, jsx_runtime_1.jsx)("option", { value: 1440, children: "24 hours" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm mt-2", children: "How often to sync with connected platforms" })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: "\uD83D\uDCBB" }), "System Information"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm mb-1", children: "Application Version" }), (0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: "GamePilot v1.0.0" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm mb-1", children: "Browser" }), (0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: navigator.userAgent.split(' ')[0] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm mb-1", children: "Platform" }), (0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: navigator.platform })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 text-sm mb-1", children: "Screen Resolution" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-white font-medium", children: [window.screen.width, "x", window.screen.height] })] })] })] })] })), activeTab === 'mood-persona' && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAD" }), "Mood & Persona Settings"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [persona && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Current Gaming Persona" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400 mb-1", children: "Archetype" }), (0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium text-lg", children: persona.traits?.archetypeId })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400 mb-1", children: "Confidence" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-white font-medium text-lg", children: [Math.round((persona.confidence || 0) * 100), "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400 mb-1", children: "Intensity" }), (0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium text-lg", children: persona.traits?.intensity })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400 mb-1", children: "Pacing" }), (0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium text-lg", children: persona.traits?.pacing })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 mt-4", children: "Your persona is calculated based on your gaming patterns and preferences." })] })), hasRecommendations && primaryMoodInfo && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Current Mood State" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-3xl", children: primaryMoodInfo.emoji }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium text-lg", children: primaryMoodInfo.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Active mood for recommendations" })] })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800/50 rounded-lg p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Preferences" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: "Auto-select Mood" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Automatically set mood based on time and patterns" })] }), (0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-gaming-accent text-white rounded-lg hover:bg-gaming-accent/80 transition-colors", children: "Enable" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: "Persona Recalibration" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Recalculate persona based on recent activity" })] }), (0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors", children: "Recalculate" })] })] })] })] })] }) })), activeTab === 'api-keys' && ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDD11" }), "API Keys"] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-blue-400 mb-2", children: "\uD83D\uDD10 Security Notice" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 text-sm", children: "API keys are sensitive information. They are stored locally in your browser and never sent to our servers." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: "\uD83D\uDCFA YouTube" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: "Gaming content and videos" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [apiKeys.youtubeApiKey && ((0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-green-500 rounded-full" })), (0, jsx_runtime_1.jsx)("button", { onClick: () => testApiKey('youtube'), disabled: testingApiKey === 'youtube', className: "px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed", children: testingApiKey === 'youtube' ? 'Testing...' : 'Test' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("input", { id: "youtube-api-key", type: "password", value: apiKeys.youtubeApiKey, onChange: (e) => updateApiKey('youtubeApiKey', e.target.value), placeholder: "Enter YouTube API Key", className: "w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-gaming-primary focus:outline-none" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-400", children: "Get your API key from Google Cloud Console" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.open('https://console.cloud.google.com/apis/credentials', '_blank'), className: "text-xs text-blue-400 hover:text-blue-300 underline", children: "Get API Key" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: "\uD83D\uDCAC Discord Bot" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: "Bot token for server management" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [apiKeys.discordBotToken && ((0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-green-500 rounded-full" })), (0, jsx_runtime_1.jsx)("button", { onClick: () => testApiKey('discord'), disabled: testingApiKey === 'discord', className: "px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed", children: testingApiKey === 'discord' ? 'Testing...' : 'Test' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("input", { id: "discord-bot-token", type: "password", value: apiKeys.discordBotToken, onChange: (e) => updateApiKey('discordBotToken', e.target.value), placeholder: "Enter Discord Bot Token", className: "w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-gaming-primary focus:outline-none" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-400", children: "Create a bot at Discord Developer Portal" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.open('https://discord.com/developers/applications', '_blank'), className: "text-xs text-blue-400 hover:text-blue-300 underline", children: "Create Bot" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: "\uD83C\uDFAE Steam" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: "Steam Web API key" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [apiKeys.steamApiKey && ((0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-green-500 rounded-full" })), (0, jsx_runtime_1.jsx)("button", { onClick: () => testApiKey('steam'), disabled: testingApiKey === 'steam', className: "px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed", children: testingApiKey === 'steam' ? 'Testing...' : 'Test' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("input", { id: "steam-api-key", type: "password", value: apiKeys.steamApiKey, onChange: (e) => updateApiKey('steamApiKey', e.target.value), placeholder: "Enter Steam Web API Key", className: "w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-gaming-primary focus:outline-none" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-400", children: "Get your key from Steam Web API" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.open('https://steamcommunity.com/dev/apikey', '_blank'), className: "text-xs text-blue-400 hover:text-blue-300 underline", children: "Get API Key" })] })] })] })] })] })), activeTab === 'integrations' && ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDD17" }), "Integrations"] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-blue-400 mb-2", children: "\uD83D\uDD17 Platform Connections" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 text-sm", children: "Connect your gaming platforms to sync data and enhance your experience." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: "\uD83C\uDFAE Steam" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: "Game library and achievements" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => updateIntegration('steam', !integrations.steamConnected), "aria-label": `Toggle Steam integration ${integrations.steamConnected ? 'off' : 'on'}`, className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${integrations.steamConnected ? 'bg-gaming-accent' : 'bg-gray-600'}`, children: (0, jsx_runtime_1.jsx)("span", { className: `inline-block h-4 w-4 rounded-full bg-white transition-transform ${integrations.steamConnected ? 'translate-x-6' : 'translate-x-1'}` }) })] }), integrations.steamConnected && ((0, jsx_runtime_1.jsx)("div", { className: "mt-3 p-3 bg-gray-900/50 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-300", children: ["\u2705 Connected as ", integrations.steamUsername || 'User'] }) }))] }), ['discord', 'youtube', 'gog', 'epic', 'twitch', 'reddit', 'twitter', 'spotify'].map((platform) => {
                                                    const isConnected = platform === 'discord' ? integrations.discordConnected :
                                                        platform === 'youtube' ? integrations.youtubeConnected :
                                                            platform === 'gog' ? integrations.gogConnected :
                                                                platform === 'epic' ? integrations.epicConnected :
                                                                    platform === 'twitch' ? false :
                                                                        platform === 'reddit' ? false :
                                                                            platform === 'twitter' ? false :
                                                                                platform === 'spotify' ? false : false;
                                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-white font-medium capitalize", children: [platform === 'discord' && '💬 Discord', platform === 'youtube' && '📺 YouTube', platform === 'gog' && '🎯 GOG', platform === 'epic' && '🚀 Epic Games', platform === 'twitch' && '🎬 Twitch', platform === 'reddit' && '🤖 Reddit', platform === 'twitter' && '🐦 Twitter/X', platform === 'spotify' && '🎵 Spotify'] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400 text-sm", children: [platform === 'discord' && 'Rich presence and chat', platform === 'youtube' && 'Game videos and trailers', platform === 'gog' && 'GOG galaxy integration', platform === 'epic' && 'Epic games store', platform === 'twitch' && 'Live streaming platform', platform === 'reddit' && 'Gaming discussions', platform === 'twitter' && 'Gaming news and updates', platform === 'spotify' && 'Music and playlists'] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => updateIntegration(platform, !isConnected), "aria-label": `Toggle ${platform} integration ${isConnected ? 'off' : 'on'}`, className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isConnected ? 'bg-gaming-accent' : 'bg-gray-600'}`, children: (0, jsx_runtime_1.jsx)("span", { className: `inline-block h-4 w-4 rounded-full bg-white transition-transform ${isConnected ? 'translate-x-6' : 'translate-x-1'}` }) })] }, platform));
                                                })] })] })), activeTab === 'notifications' && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDD14" }), "Notification Preferences"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-white mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDFAE" }), "Gaming Notifications"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: ['achievements', 'friendActivity', 'gameUpdates'].map((type) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-800/30 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-white font-medium", children: [type === 'achievements' && '🏆 Achievement Unlocked', type === 'friendActivity' && '👥 Friend Activity', type === 'gameUpdates' && '📰 Game Updates'] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400 text-sm", children: [type === 'achievements' && 'Get notified when you unlock new achievements', type === 'friendActivity' && 'See when friends come online or start playing', type === 'gameUpdates' && 'Updates about your games and DLC'] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => updateNotification(type, !notifications[type]), "aria-label": `Toggle ${type} notifications ${notifications[type] ? 'off' : 'on'}`, className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[type] ? 'bg-gaming-accent' : 'bg-gray-600'}`, children: (0, jsx_runtime_1.jsx)("span", { className: `inline-block h-4 w-4 rounded-full bg-white transition-transform ${notifications[type] ? 'translate-x-6' : 'translate-x-1'}` }) })] }, type))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-white mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83C\uDF10" }), "Platform Notifications"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: ['discordMessages', 'youtubeNotifications'].map((type) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-800/30 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-white font-medium", children: [type === 'discordMessages' && '💬 Discord Messages', type === 'youtubeNotifications' && '📺 YouTube Notifications'] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400 text-sm", children: [type === 'discordMessages' && 'Receive Discord message notifications', type === 'youtubeNotifications' && 'YouTube video recommendations and updates'] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => updateNotification(type, !notifications[type]), "aria-label": `Toggle ${type} notifications ${notifications[type] ? 'off' : 'on'}`, className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[type] ? 'bg-gaming-accent' : 'bg-gray-600'}`, children: (0, jsx_runtime_1.jsx)("span", { className: `inline-block h-4 w-4 rounded-full bg-white transition-transform ${notifications[type] ? 'translate-x-6' : 'translate-x-1'}` }) })] }, type))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-white mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDCE2" }), "General Notifications"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: ['news'].map((type) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-800/30 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: type === 'news' && '📰 Gaming News' }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: type === 'news' && 'Latest gaming news and updates' })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => updateNotification(type, !notifications[type]), "aria-label": `Toggle ${type} notifications ${notifications[type] ? 'off' : 'on'}`, className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[type] ? 'bg-gaming-accent' : 'bg-gray-600'}`, children: (0, jsx_runtime_1.jsx)("span", { className: `inline-block h-4 w-4 rounded-full bg-white transition-transform ${notifications[type] ? 'translate-x-6' : 'translate-x-1'}` }) })] }, type))) })] })] })] }) })), activeTab === 'privacy' && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDD12" }), "Privacy Settings"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-white mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDC64" }), "Profile Privacy"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: ['profilePublic', 'showPlaytime', 'shareAchievements'].map((setting) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-800/30 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-white font-medium", children: [setting === 'profilePublic' && '🌍 Public Profile', setting === 'showPlaytime' && '⏱️ Show Playtime', setting === 'shareAchievements' && '🏆 Share Achievements'] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400 text-sm", children: [setting === 'profilePublic' && 'Make profile visible to other users', setting === 'showPlaytime' && 'Display total playtime on profile', setting === 'shareAchievements' && 'Share achievements on social media'] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => updatePrivacy(setting, !privacy[setting]), "aria-label": `Toggle ${setting} ${privacy[setting] ? 'off' : 'on'}`, className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${privacy[setting] ? 'bg-gaming-accent' : 'bg-gray-600'}`, children: (0, jsx_runtime_1.jsx)("span", { className: `inline-block h-4 w-4 rounded-full bg-white transition-transform ${privacy[setting] ? 'translate-x-6' : 'translate-x-1'}` }) })] }, setting))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-white mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDCCA" }), "Data & Analytics"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: ['dataCollection', 'analyticsEnabled'].map((setting) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-800/30 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-white font-medium", children: [setting === 'dataCollection' && '📊 Data Collection', setting === 'analyticsEnabled' && '📈 Analytics'] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400 text-sm", children: [setting === 'dataCollection' && 'Allow data collection for improvements', setting === 'analyticsEnabled' && 'Help improve GamePilot with usage analytics'] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => updatePrivacy(setting, !privacy[setting]), "aria-label": `Toggle ${setting} ${privacy[setting] ? 'off' : 'on'}`, className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${privacy[setting] ? 'bg-gaming-accent' : 'bg-gray-600'}`, children: (0, jsx_runtime_1.jsx)("span", { className: `inline-block h-4 w-4 rounded-full bg-white transition-transform ${privacy[setting] ? 'translate-x-6' : 'translate-x-1'}` }) })] }, setting))) })] })] })] }) })), activeTab === 'emulators' && ((0, jsx_runtime_1.jsxs)("div", { className: "glass-morphism rounded-xl p-8", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAE" }), "Emulator Configuration"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 bg-gray-800/50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: "\uD83C\uDFAE Retro Gaming Support" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: "Configure emulators for retro game libraries" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${emulators.length > 0
                                                                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                                        : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'}`, children: [emulators.length, " configured"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: openEmulatorConfig, className: "px-4 py-2 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 transition-colors font-medium flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u2699\uFE0F" }), (0, jsx_runtime_1.jsx)("span", { children: "Configure" })] })] })] }), emulators.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-3", children: "Configured Emulators" }), emulators.map((config) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-800/30 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium", children: config.name }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: config.supportedSystems.join(', ') })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: `w-2 h-2 rounded-full ${config.executablePath ? 'bg-green-500' : 'bg-yellow-500'}` }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 text-sm", children: config.executablePath ? 'Ready' : 'Needs path' })] })] }, config.platform)))] }))] })] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center gap-4 pt-8", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                    setGeneral({
                                        language: 'en',
                                        timezone: 'UTC',
                                        dateFormat: 'MM/DD/YYYY',
                                        autoSync: true,
                                        syncInterval: 30
                                    });
                                    setNotifications({
                                        achievements: true,
                                        friendActivity: true,
                                        gameUpdates: false,
                                        news: false,
                                        discordMessages: true,
                                        youtubeNotifications: false
                                    });
                                    setPrivacy({
                                        profilePublic: true,
                                        showPlaytime: true,
                                        shareAchievements: false,
                                        dataCollection: true,
                                        analyticsEnabled: true
                                    });
                                }, className: "px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors", children: "\uD83D\uDD04 Reset to Defaults" }) })] }) }), showBirthdayCelebration && ((0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 z-50 flex items-center justify-center pointer-events-none", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10 text-center animate-bounce", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83C\uDF82" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-4xl font-bold text-white mb-2", children: ["Happy Birthday, ", user?.username || 'Gamer', "!"] }), (0, jsx_runtime_1.jsx)("div", { className: "text-xl text-gray-300 mb-4", children: "\uD83C\uDF89\uD83C\uDF88\uD83C\uDF8A" }), (0, jsx_runtime_1.jsx)("div", { className: "text-lg text-gaming-accent", children: "Wishing you an amazing day filled with gaming adventures!" }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 flex justify-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl animate-pulse", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("span", { className: "text-2xl animate-pulse delay-100", children: "\uD83C\uDFAF" }), (0, jsx_runtime_1.jsx)("span", { className: "text-2xl animate-pulse delay-200", children: "\uD83C\uDFC6" }), (0, jsx_runtime_1.jsx)("span", { className: "text-2xl animate-pulse delay-300", children: "\uD83C\uDF1F" })] })] })] })), (0, jsx_runtime_1.jsx)(EmulatorConfig_1.EmulatorConfig, { isOpen: showEmulatorConfig, onClose: closeEmulatorConfig, onSave: handleEmulatorConfigSave })] }));
};
exports.Settings = Settings;
