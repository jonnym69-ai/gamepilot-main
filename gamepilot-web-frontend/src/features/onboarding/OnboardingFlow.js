"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// User Onboarding Flow for GamePilot
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const Button_1 = require("../../components/ui/Button");
const Card_1 = require("../../components/ui/Card");
const OnboardingFlow = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [currentStep, setCurrentStep] = (0, react_1.useState)(0);
    const [onboardingData, setOnboardingData] = (0, react_1.useState)({
        displayName: '',
        bio: '',
        favoriteGenres: [],
        favoritePlatforms: [],
        playstylePreferences: [],
        privacySettings: {
            profileVisibility: 'friends',
            sharePlaytime: true,
            shareAchievements: true,
            shareGameLibrary: false
        },
        integrations: {
            steam: false,
            discord: false,
            youtube: false
        }
    });
    const steps = [
        {
            id: 'welcome',
            title: 'Welcome to GamePilot!',
            description: 'Let\'s get you set up with your personalized gaming experience.',
            component: WelcomeStep,
            completed: false,
            skipped: false
        },
        {
            id: 'profile',
            title: 'Create Your Profile',
            description: 'Tell us a bit about yourself to personalize your experience.',
            component: ProfileStep,
            completed: false,
            skipped: false
        },
        {
            id: 'preferences',
            title: 'Gaming Preferences',
            description: 'Help us understand your gaming style and preferences.',
            component: PreferencesStep,
            completed: false,
            skipped: false
        },
        {
            id: 'privacy',
            title: 'Privacy Settings',
            description: 'Control how your information is shared and displayed.',
            component: PrivacyStep,
            completed: false,
            skipped: false
        },
        {
            id: 'integrations',
            title: 'Connect Your Accounts',
            description: 'Link your gaming accounts for a complete experience.',
            component: IntegrationsStep,
            completed: false,
            skipped: false
        },
        {
            id: 'complete',
            title: 'All Set!',
            description: 'You\'re ready to start your gaming journey with GamePilot.',
            component: CompleteStep,
            completed: false,
            skipped: false
        }
    ];
    const currentStepData = steps[currentStep];
    const handleNext = (data) => {
        if (data) {
            setOnboardingData(prev => ({ ...prev, ...data }));
        }
        // Mark current step as completed
        steps[currentStep].completed = true;
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
        else {
            // Complete onboarding
            completeOnboarding();
        }
    };
    const handleSkip = () => {
        steps[currentStep].skipped = true;
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
        else {
            completeOnboarding();
        }
    };
    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    const completeOnboarding = () => {
        // Save onboarding data to user profile
        // This would typically make an API call
        console.log('Onboarding completed:', onboardingData);
        // Navigate to dashboard
        navigate('/dashboard');
    };
    const CurrentStepComponent = currentStepData.component;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gaming-darker relative overflow-hidden flex items-center justify-center p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gaming-primary/10 rounded-full blur-[120px] animate-pulse-slow" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gaming-secondary/10 rounded-full blur-[120px] animate-pulse-slow animate-delay-1000" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-4xl relative z-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-white font-gaming text-xs uppercase tracking-widest opacity-60", children: ["Phase ", currentStep + 1, " ", (0, jsx_runtime_1.jsx)("span", { className: "mx-2", children: "/" }), " ", steps.length] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/dashboard'), className: "text-white/40 hover:text-gaming-primary transition-colors text-xs font-gaming uppercase tracking-wider", children: "Skip Sequence" })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-gaming h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(139,92,246,0.4)]", style: { width: `${((currentStep + 1) / steps.length) * 100}%` } }) })] }), (0, jsx_runtime_1.jsxs)(Card_1.Card, { className: "glass-morphism-dark border-white/10 p-10 shadow-cinematic-epic animate-fade-in-up", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-10", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-gaming font-bold text-white mb-3 tracking-tight", children: currentStepData.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/50 max-w-lg mx-auto leading-relaxed", children: currentStepData.description })] }), (0, jsx_runtime_1.jsx)(CurrentStepComponent, { data: onboardingData, onNext: handleNext, onSkip: handleSkip, onBack: handleBack, isLastStep: currentStep === steps.length - 1, isFirstStep: currentStep === 0 })] })] })] }));
};
// Welcome Step Component
const WelcomeStep = ({ onNext }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "text-center max-w-2xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-24 h-24 bg-gradient-gaming rounded-2xl mx-auto mb-6 flex items-center justify-center rotate-3 shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:rotate-0 transition-transform duration-500", children: (0, jsx_runtime_1.jsx)("span", { className: "text-white text-4xl drop-shadow-lg", children: "\uD83C\uDFAE" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-gaming font-bold text-white mb-4 tracking-tight", children: "Initiating Sequence" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/40 text-lg leading-relaxed", children: "Your personal gaming companion is ready to optimize your universe." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mb-12", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center group", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-white/5 border border-white/10 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:bg-gaming-primary/20 group-hover:border-gaming-primary/40 transition-all duration-300", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl group-hover:scale-110 transition-transform", children: "\uD83C\uDFAF" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white font-gaming text-xs uppercase tracking-wider mb-2", children: "Neural Link" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/30 text-xs leading-relaxed", children: "Recommendations aligned with your biological mood." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center group", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-white/5 border border-white/10 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:bg-gaming-secondary/20 group-hover:border-gaming-secondary/40 transition-all duration-300", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl group-hover:scale-110 transition-transform", children: "\uD83D\uDCCA" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white font-gaming text-xs uppercase tracking-wider mb-2", children: "Telemetry" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/30 text-xs leading-relaxed", children: "Real-time tracking of your achievements and habits." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center group", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-white/5 border border-white/10 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:bg-gaming-accent/20 group-hover:border-gaming-accent/40 transition-all duration-300", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl group-hover:scale-110 transition-transform", children: "\uD83C\uDF1F" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white font-gaming text-xs uppercase tracking-wider mb-2", children: "Nexus" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/30 text-xs leading-relaxed", children: "Unify your platforms into a single command center." })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: () => onNext(), className: "bg-gradient-gaming text-white px-10 py-4 font-gaming uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transform hover:-translate-y-1 transition-all", children: "Begin Initialization" }) })] }));
};
// Profile Step Component
const ProfileStep = ({ data, onNext, onSkip, onBack }) => {
    const [displayName, setDisplayName] = (0, react_1.useState)(data.displayName);
    const [bio, setBio] = (0, react_1.useState)(data.bio);
    const handleSubmit = () => {
        onNext({ displayName, bio });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-white/50 font-gaming text-xs uppercase tracking-widest mb-3", children: "Display Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: displayName, onChange: (e) => setDisplayName(e.target.value), placeholder: "How should we call you?", className: "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-gaming-primary/50 focus:bg-white/10 transition-all", maxLength: 50 })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-white/50 font-gaming text-xs uppercase tracking-widest mb-3", children: "Bio (Optional)" }), (0, jsx_runtime_1.jsx)("textarea", { value: bio, onChange: (e) => setBio(e.target.value), placeholder: "Tell us about yourself...", className: "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-gaming-primary/50 focus:bg-white/10 transition-all resize-none", rows: 4, maxLength: 200 })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-white/60 text-sm", children: (0, jsx_runtime_1.jsx)("p", { children: "This information will be displayed on your profile and used to personalize your experience." }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between mt-8", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: onBack, variant: "secondary", className: "text-white", children: "Back" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: onSkip, variant: "secondary", className: "text-white", children: "Skip" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: handleSubmit, className: "bg-gradient-to-r from-purple-500 to-blue-500 text-white", children: "Next" })] })] })] }));
};
// Preferences Step Component
const PreferencesStep = ({ data, onNext, onSkip, onBack }) => {
    const [favoriteGenres, setFavoriteGenres] = (0, react_1.useState)(data.favoriteGenres);
    const [favoritePlatforms, setFavoritePlatforms] = (0, react_1.useState)(data.favoritePlatforms);
    const [playstylePreferences, setPlaystylePreferences] = (0, react_1.useState)(data.playstylePreferences);
    const genres = [
        'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Racing', 'Puzzle',
        'Horror', 'Sci-Fi', 'Fantasy', 'Indie', 'Multiplayer', 'Single Player', 'Co-op'
    ];
    const platforms = [
        'Steam', 'Epic Games', 'GOG', 'Origin', 'Xbox', 'PlayStation', 'Nintendo Switch', 'Mobile'
    ];
    const playstyles = [
        'Competitive', 'Casual', 'Story-driven', 'Exploration', 'Creative', 'Social', 'Achievement Hunter', 'Completionist'
    ];
    const handleGenreToggle = (genre) => {
        setFavoriteGenres(prev => prev.includes(genre)
            ? prev.filter(g => g !== genre)
            : [...prev, genre]);
    };
    const handlePlatformToggle = (platform) => {
        setFavoritePlatforms(prev => prev.includes(platform)
            ? prev.filter(p => p !== platform)
            : [...prev, platform]);
    };
    const handlePlaystyleToggle = (playstyle) => {
        setPlaystylePreferences(prev => prev.includes(playstyle)
            ? prev.filter(p => p !== playstyle)
            : [...prev, playstyle]);
    };
    const handleSubmit = () => {
        onNext({ favoriteGenres, favoritePlatforms, playstylePreferences });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white/50 font-gaming text-xs uppercase tracking-widest mb-5", children: "Primary Genres" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: genres.map(genre => ((0, jsx_runtime_1.jsx)("button", { onClick: () => handleGenreToggle(genre), className: `px-3 py-2 rounded-lg border transition-all duration-300 font-medium text-sm ${favoriteGenres.includes(genre)
                                        ? 'bg-gaming-primary/30 border-gaming-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                                        : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20 hover:text-white'}`, children: genre }, genre))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white/50 font-gaming text-xs uppercase tracking-widest mb-5", children: "Hardware Platforms" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: platforms.map(platform => ((0, jsx_runtime_1.jsx)("button", { onClick: () => handlePlatformToggle(platform), className: `px-3 py-2 rounded-lg border transition-all duration-300 font-medium text-sm ${favoritePlatforms.includes(platform)
                                        ? 'bg-gaming-secondary/30 border-gaming-secondary text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                        : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20 hover:text-white'}`, children: platform }, platform))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white/50 font-gaming text-xs uppercase tracking-widest mb-5", children: "Behavioral Profiles" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: playstyles.map(playstyle => ((0, jsx_runtime_1.jsx)("button", { onClick: () => handlePlaystyleToggle(playstyle), className: `px-3 py-2 rounded-lg border transition-all duration-300 font-medium text-sm ${playstylePreferences.includes(playstyle)
                                        ? 'bg-gaming-primary/30 border-gaming-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                                        : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20 hover:text-white'}`, children: playstyle }, playstyle))) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between mt-8", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: onBack, variant: "secondary", className: "text-white", children: "Back" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: onSkip, variant: "secondary", className: "text-white", children: "Skip" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: handleSubmit, className: "bg-gradient-to-r from-purple-500 to-blue-500 text-white", children: "Next" })] })] })] }));
};
// Privacy Step Component
const PrivacyStep = ({ data, onNext, onSkip, onBack }) => {
    const [privacySettings, setPrivacySettings] = (0, react_1.useState)(data.privacySettings);
    const handleSettingChange = (key, value) => {
        setPrivacySettings(prev => ({ ...prev, [key]: value }));
    };
    const handleSubmit = () => {
        onNext({ privacySettings });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white/50 font-gaming text-xs uppercase tracking-widest mb-5", children: "Visibility Protocol" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: ['public', 'friends', 'private'].map((mode) => ((0, jsx_runtime_1.jsxs)("label", { className: `flex items-center p-4 rounded-xl border transition-all cursor-pointer group ${privacySettings.profileVisibility === mode
                                        ? 'bg-gaming-primary/10 border-gaming-primary/40 text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10'}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex items-center justify-center mr-4", children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "visibility", value: mode, checked: privacySettings.profileVisibility === mode, onChange: () => handleSettingChange('profileVisibility', mode), className: "sr-only" }), (0, jsx_runtime_1.jsx)("div", { className: `w-5 h-5 rounded-full border-2 transition-all ${privacySettings.profileVisibility === mode ? 'border-gaming-primary bg-gaming-primary scale-110' : 'border-white/20'}`, children: privacySettings.profileVisibility === mode && ((0, jsx_runtime_1.jsx)("div", { className: "w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-gaming text-xs uppercase tracking-wider mb-0.5 capitalize", children: mode }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] opacity-60", children: mode === 'public' ? 'Full broadcast - visible to all users' :
                                                        mode === 'friends' ? 'Encrypted - visible to squad only' :
                                                            'Ghost mode - hidden from all telemetry' })] })] }, mode))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-semibold mb-4", children: "Sharing Preferences" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("label", { className: "flex items-center text-white", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: privacySettings.sharePlaytime, onChange: (e) => handleSettingChange('sharePlaytime', e.target.checked), className: "mr-3" }), (0, jsx_runtime_1.jsx)("span", { children: "Share playtime statistics" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center text-white", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: privacySettings.shareAchievements, onChange: (e) => handleSettingChange('shareAchievements', e.target.checked), className: "mr-3" }), (0, jsx_runtime_1.jsx)("span", { children: "Share achievements" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center text-white", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: privacySettings.shareGameLibrary, onChange: (e) => handleSettingChange('shareGameLibrary', e.target.checked), className: "mr-3" }), (0, jsx_runtime_1.jsx)("span", { children: "Share game library" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-white/60 text-sm", children: (0, jsx_runtime_1.jsx)("p", { children: "You can always change these settings later in your profile preferences." }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between mt-8", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: onBack, variant: "secondary", className: "text-white", children: "Back" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: onSkip, variant: "secondary", className: "text-white", children: "Skip" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: handleSubmit, className: "bg-gradient-to-r from-purple-500 to-blue-500 text-white", children: "Next" })] })] })] }));
};
// Integrations Step Component
const IntegrationsStep = ({ data, onNext, onSkip, onBack }) => {
    const [integrations, setIntegrations] = (0, react_1.useState)(data.integrations);
    const handleIntegrationToggle = (platform) => {
        setIntegrations(prev => ({ ...prev, [platform]: !prev[platform] }));
    };
    const handleSubmit = () => {
        onNext({ integrations });
    };
    const integrationInfo = [
        {
            key: 'steam',
            name: 'Steam',
            description: 'Connect your Steam account to import your game library and playtime',
            icon: '🎮',
            color: 'blue'
        },
        {
            key: 'discord',
            name: 'Discord',
            description: 'Connect Discord to see your gaming activity and join communities',
            icon: '💬',
            color: 'purple'
        },
        {
            key: 'youtube',
            name: 'YouTube',
            description: 'Connect YouTube to discover gaming content and creators',
            icon: '📺',
            color: 'red'
        }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-white/70 mb-6", children: (0, jsx_runtime_1.jsx)("p", { children: "Connect your gaming accounts to get the most out of GamePilot. You can always connect or disconnect accounts later." }) }), integrationInfo.map(integration => ((0, jsx_runtime_1.jsx)("div", { className: "glass-morphism-dark border-white/5 rounded-xl p-6 hover:border-white/10 transition-all group", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-5", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl filter group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-all duration-500", children: integration.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-gaming text-sm uppercase tracking-wider mb-1", children: integration.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/30 text-xs leading-relaxed max-w-sm", children: integration.description })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleIntegrationToggle(integration.key), className: `px-5 py-2.5 rounded-lg border font-gaming text-[10px] uppercase tracking-widest transition-all duration-300 ${integrations[integration.key]
                                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                        : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20 hover:text-white'}`, children: integrations[integration.key] ? 'Synchronized' : 'Connect' })] }) }, integration.key)))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between mt-8", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: onBack, variant: "secondary", className: "text-white", children: "Back" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: onSkip, variant: "secondary", className: "text-white", children: "Skip" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: handleSubmit, className: "bg-gradient-to-r from-purple-500 to-blue-500 text-white", children: "Complete Setup" })] })] })] }));
};
// Complete Step Component
const CompleteStep = ({ onNext }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mx-auto mb-6 flex items-center justify-center rotate-3 shadow-[0_0_30px_rgba(16,185,129,0.3)]", children: (0, jsx_runtime_1.jsx)("span", { className: "text-white text-4xl", children: "\uD83D\uDE80" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-gaming font-bold text-white mb-4 tracking-tight uppercase", children: "System Operational" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/40 text-lg leading-relaxed", children: "Your profile is synced. Welcome to the cockpit, Pilot." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mb-12", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-white/5 border border-white/10 rounded-xl mx-auto mb-4 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAE" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white font-gaming text-xs uppercase tracking-wider mb-2", children: "Discovery" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/30 text-xs leading-relaxed", children: "Neural filters are active. Discover your next world." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-white/5 border border-white/10 rounded-xl mx-auto mb-4 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDCCA" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white font-gaming text-xs uppercase tracking-wider mb-2", children: "Analytics" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/30 text-xs leading-relaxed", children: "Telemetry is syncing. Track your evolution." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-white/5 border border-white/10 rounded-xl mx-auto mb-4 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDF1F" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white font-gaming text-xs uppercase tracking-wider mb-2", children: "Legacy" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/30 text-xs leading-relaxed", children: "Connect your friends and build your gaming history." })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center", children: (0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: () => onNext(), className: "bg-gradient-gaming text-white px-10 py-4 font-gaming uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)] transform hover:-translate-y-1 transition-all", children: "Enter Dashboard" }) })] }));
};
exports.default = OnboardingFlow;
