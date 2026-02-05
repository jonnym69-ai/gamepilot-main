"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOnboarding = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const authStore_1 = require("../../store/authStore");
const UserOnboarding = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { user, updateProfile } = (0, authStore_1.useAuthStore)();
    const [currentStep, setCurrentStep] = (0, react_1.useState)(0);
    const [onboardingData, setOnboardingData] = (0, react_1.useState)({
        preferredGenres: [],
        gamingPlatforms: [],
        playstyle: '',
        gamingFrequency: '',
        notifications: true,
        privacy: {
            analytics: true,
            recommendations: true,
            social: false
        }
    });
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const onboardingSteps = [
        {
            id: 'welcome',
            title: 'Welcome to GamePilot!',
            description: 'Your personal gaming identity platform',
            component: WelcomeStep,
            completed: false,
            skipped: false
        },
        {
            id: 'genres',
            title: 'Choose Your Favorite Genres',
            description: 'Help us understand your gaming preferences',
            component: GenreSelectionStep,
            completed: false,
            skipped: false
        },
        {
            id: 'platforms',
            title: 'Connect Your Gaming Platforms',
            description: 'Import your game library from your favorite platforms',
            component: PlatformSelectionStep,
            completed: false,
            skipped: false
        },
        {
            id: 'playstyle',
            title: 'What\'s Your Gaming Style?',
            description: 'Discover your unique gaming personality',
            component: PlaystyleStep,
            completed: false,
            skipped: false
        },
        {
            id: 'frequency',
            title: 'How Often Do You Game?',
            description: 'Set your gaming frequency for better recommendations',
            component: FrequencyStep,
            completed: false,
            skipped: false
        },
        {
            id: 'privacy',
            title: 'Privacy & Notifications',
            description: 'Control your data and notification preferences',
            component: PrivacyStep,
            completed: false,
            skipped: false
        },
        {
            id: 'complete',
            title: 'All Set!',
            description: 'Your personalized gaming experience awaits',
            component: CompleteStep,
            completed: false,
            skipped: false
        }
    ];
    (0, react_1.useEffect)(() => {
        // Check if user has already completed onboarding
        if (user?.onboardingCompleted) {
            navigate('/home');
        }
    }, [user, navigate]);
    const handleNext = async () => {
        if (currentStep < onboardingSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
        else {
            await completeOnboarding();
        }
    };
    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    const handleSkip = () => {
        const updatedSteps = [...onboardingSteps];
        updatedSteps[currentStep].skipped = true;
        if (currentStep < onboardingSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
        else {
            completeOnboarding();
        }
    };
    const completeOnboarding = async () => {
        setIsLoading(true);
        try {
            await updateProfile({
                onboardingCompleted: true,
                preferences: {
                    favoriteGenres: onboardingData.preferredGenres || [],
                    moodPreferences: onboardingData.gamingPlatforms || [],
                    notifications: onboardingData.notifications
                }
            });
            navigate('/home');
        }
        catch (error) {
            console.error('Error completing onboarding:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const updateOnboardingData = (data) => {
        setOnboardingData(prev => ({ ...prev, ...data }));
    };
    const CurrentStepComponent = onboardingSteps[currentStep].component;
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl w-full", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-white text-2xl font-bold", children: "GamePilot Setup" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white text-sm opacity-75", children: ["Step ", currentStep + 1, " of ", onboardingSteps.length] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-white/20 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300", style: { width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` } }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-white mb-2", children: onboardingSteps[currentStep].title }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/80", children: onboardingSteps[currentStep].description })] }), (0, jsx_runtime_1.jsx)(CurrentStepComponent, { data: onboardingData, updateData: updateOnboardingData, onNext: handleNext, onPrevious: handlePrevious, onSkip: handleSkip, isLoading: isLoading, isFirstStep: currentStep === 0, isLastStep: currentStep === onboardingSteps.length - 1 })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center mt-6 space-x-2", children: onboardingSteps.map((step, index) => ((0, jsx_runtime_1.jsx)("div", { className: `w-2 h-2 rounded-full transition-all duration-300 ${index === currentStep
                            ? 'bg-white'
                            : index < currentStep
                                ? 'bg-white/50'
                                : 'bg-white/20'}` }, step.id))) })] }) }));
};
exports.UserOnboarding = UserOnboarding;
// Welcome Step Component
const WelcomeStep = ({ onNext, onSkip, isLoading }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-6xl", children: "\uD83C\uDFAE" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white mb-4", children: "Welcome to GamePilot!" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/80 max-w-md mx-auto", children: "GamePilot is your personal gaming identity platform that helps you discover, organize, and connect your gaming experiences across multiple platforms." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl mb-2", children: "\uD83C\uDFAF" }), (0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-white mb-2", children: "Personalized Recommendations" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/70 text-sm", children: "Get game recommendations based on your mood and playstyle" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl mb-2", children: "\uD83D\uDCDA" }), (0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-white mb-2", children: "Unified Library" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/70 text-sm", children: "Organize games from Steam, Epic, and more in one place" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl mb-2", children: "\uD83E\uDD16" }), (0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-white mb-2", children: "AI-Powered Insights" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/70 text-sm", children: "Discover your gaming personality and patterns" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-center space-x-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onSkip, className: "px-6 py-3 text-white/70 hover:text-white transition-colors", children: "Skip Setup" }), (0, jsx_runtime_1.jsx)("button", { onClick: onNext, disabled: isLoading, className: "px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50", children: isLoading ? 'Loading...' : 'Get Started' })] })] }));
};
// Genre Selection Step Component
const GenreSelectionStep = ({ data, updateData, onNext, onPrevious, onSkip, isLoading }) => {
    const genres = [
        { id: 'action', name: 'Action', emoji: '⚔️' },
        { id: 'adventure', name: 'Adventure', emoji: '🗺️' },
        { id: 'rpg', name: 'RPG', emoji: '🎭' },
        { id: 'strategy', name: 'Strategy', emoji: '♟️' },
        { id: 'puzzle', name: 'Puzzle', emoji: '🧩' },
        { id: 'simulation', name: 'Simulation', emoji: '🏗️' },
        { id: 'sports', name: 'Sports', emoji: '⚽' },
        { id: 'racing', name: 'Racing', emoji: '🏎️' },
        { id: 'horror', name: 'Horror', emoji: '👻' },
        { id: 'comedy', name: 'Comedy', emoji: '😄' },
        { id: 'drama', name: 'Drama', emoji: '🎬' },
        { id: 'fantasy', name: 'Fantasy', emoji: '🧙‍♂️' }
    ];
    const toggleGenre = (genreId) => {
        const newGenres = data.preferredGenres.includes(genreId)
            ? data.preferredGenres.filter(id => id !== genreId)
            : [...data.preferredGenres, genreId];
        updateData({ preferredGenres: newGenres });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-6", children: (0, jsx_runtime_1.jsx)("p", { className: "text-white/80 text-center", children: "Select your favorite genres (choose at least 3)" }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8", children: genres.map(genre => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => toggleGenre(genre.id), className: `p-4 rounded-lg border-2 transition-all ${data.preferredGenres.includes(genre.id)
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 bg-white/10 hover:border-white/40'}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl mb-2", children: genre.emoji }), (0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: genre.name })] }, genre.id))) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onPrevious, className: "px-6 py-3 text-white/70 hover:text-white transition-colors", children: "Previous" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-x-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onSkip, className: "px-6 py-3 text-white/70 hover:text-white transition-colors", children: "Skip" }), (0, jsx_runtime_1.jsx)("button", { onClick: onNext, disabled: isLoading || data.preferredGenres.length < 3, className: "px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50", children: isLoading ? 'Loading...' : 'Next' })] })] })] }));
};
// Platform Selection Step Component
const PlatformSelectionStep = ({ data, updateData, onNext, onPrevious, onSkip, isLoading }) => {
    const platforms = [
        { id: 'steam', name: 'Steam', emoji: '🎮' },
        { id: 'epic', name: 'Epic Games', emoji: '🎯' },
        { id: 'gog', name: 'GOG', emoji: '🎲' },
        { id: 'xbox', name: 'Xbox', emoji: '🎮' },
        { id: 'playstation', name: 'PlayStation', emoji: '🎮' },
        { id: 'nintendo', name: 'Nintendo', emoji: '🎮' }
    ];
    const togglePlatform = (platformId) => {
        const newPlatforms = data.gamingPlatforms.includes(platformId)
            ? data.gamingPlatforms.filter(id => id !== platformId)
            : [...data.gamingPlatforms, platformId];
        updateData({ gamingPlatforms: newPlatforms });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-6", children: (0, jsx_runtime_1.jsx)("p", { className: "text-white/80 text-center", children: "Select the gaming platforms you use" }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 mb-8", children: platforms.map(platform => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => togglePlatform(platform.id), className: `p-6 rounded-lg border-2 transition-all ${data.gamingPlatforms.includes(platform.id)
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 bg-white/10 hover:border-white/40'}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl mb-2", children: platform.emoji }), (0, jsx_runtime_1.jsx)("div", { className: "text-white font-medium", children: platform.name })] }, platform.id))) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onPrevious, className: "px-6 py-3 text-white/70 hover:text-white transition-colors", children: "Previous" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-x-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onSkip, className: "px-6 py-3 text-white/70 hover:text-white transition-colors", children: "Skip" }), (0, jsx_runtime_1.jsx)("button", { onClick: onNext, disabled: isLoading, className: "px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50", children: isLoading ? 'Loading...' : 'Next' })] })] })] }));
};
// Playstyle Step Component
const PlaystyleStep = ({ data, updateData, onNext, onPrevious, onSkip, isLoading }) => {
    const playstyles = [
        { id: 'competitive', name: 'Competitive', description: 'Love challenges and winning' },
        { id: 'explorer', name: 'Explorer', description: 'Discover new worlds and secrets' },
        { id: 'story-driven', name: 'Story-driven', description: 'Immerse in narratives' },
        { id: 'creative', name: 'Creative', description: 'Build and create' },
        { id: 'social', name: 'Social', description: 'Play with friends' },
        { id: 'casual', name: 'Casual', description: 'Relax and have fun' }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-6", children: (0, jsx_runtime_1.jsx)("p", { className: "text-white/80 text-center", children: "What type of gamer are you?" }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-8", children: playstyles.map(playstyle => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => updateData({ playstyle: playstyle.id }), className: `p-4 rounded-lg border-2 transition-all text-left ${data.playstyle === playstyle.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 bg-white/10 hover:border-white/40'}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-white mb-1", children: playstyle.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-white/70 text-sm", children: playstyle.description })] }, playstyle.id))) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onPrevious, className: "px-6 py-3 text-white/70 hover:text-white transition-colors", children: "Previous" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-x-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onSkip, className: "px-6 py-3 text-white/70 hover:text-white transition-colors", children: "Skip" }), (0, jsx_runtime_1.jsx)("button", { onClick: onNext, disabled: isLoading || !data.playstyle, className: "px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50", children: isLoading ? 'Loading...' : 'Next' })] })] })] }));
};
// Frequency Step Component
const FrequencyStep = ({ data, updateData, onNext, onPrevious, onSkip, isLoading }) => {
    const frequencies = [
        { id: 'daily', name: 'Daily', description: 'Every day' },
        { id: 'weekly', name: 'Weekly', description: 'A few times a week' },
        { id: 'biweekly', name: 'Bi-weekly', description: 'Once or twice a week' },
        { id: 'monthly', name: 'Monthly', description: 'A few times a month' },
        { id: 'occasionally', name: 'Occasionally', description: 'Rarely' }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-6", children: (0, jsx_runtime_1.jsx)("p", { className: "text-white/80 text-center", children: "How often do you play games?" }) }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3 mb-8", children: frequencies.map(frequency => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => updateData({ gamingFrequency: frequency.id }), className: `w-full p-4 rounded-lg border-2 transition-all text-left ${data.gamingFrequency === frequency.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 bg-white/10 hover:border-white/40'}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-white", children: frequency.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-white/70 text-sm", children: frequency.description })] }, frequency.id))) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onPrevious, className: "px-6 py-3 text-white/70 hover:text-white transition-colors", children: "Previous" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-x-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onSkip, className: "px-6 py-3 text-white/70 hover:text-white transition-colors", children: "Skip" }), (0, jsx_runtime_1.jsx)("button", { onClick: onNext, disabled: isLoading || !data.gamingFrequency, className: "px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50", children: isLoading ? 'Loading...' : 'Next' })] })] })] }));
};
// Privacy Step Component
const PrivacyStep = ({ data, updateData, onNext, onPrevious, onSkip, isLoading }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-6", children: (0, jsx_runtime_1.jsx)("p", { className: "text-white/80 text-center", children: "Customize your privacy and notification preferences" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6 mb-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white/10 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-white", children: "Analytics" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/70 text-sm", children: "Help us improve GamePilot with usage data" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "relative inline-flex items-center cursor-pointer", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: data.privacy.analytics, onChange: (e) => updateData({
                                                privacy: { ...data.privacy, analytics: e.target.checked }
                                            }), className: "sr-only peer" }), (0, jsx_runtime_1.jsx)("div", { className: "w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/10 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-white", children: "Recommendations" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/70 text-sm", children: "Get personalized game recommendations" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "relative inline-flex items-center cursor-pointer", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: data.privacy.recommendations, onChange: (e) => updateData({
                                                privacy: { ...data.privacy, recommendations: e.target.checked }
                                            }), className: "sr-only peer" }), (0, jsx_runtime_1.jsx)("div", { className: "w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/10 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-white", children: "Social Features" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/70 text-sm", children: "Connect with friends and share achievements" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "relative inline-flex items-center cursor-pointer", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: data.privacy.social, onChange: (e) => updateData({
                                                privacy: { ...data.privacy, social: e.target.checked }
                                            }), className: "sr-only peer" }), (0, jsx_runtime_1.jsx)("div", { className: "w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/10 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-white", children: "Email Notifications" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/70 text-sm", children: "Receive updates about your games" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "relative inline-flex items-center cursor-pointer", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: data.notifications, onChange: (e) => updateData({ notifications: e.target.checked }), className: "sr-only peer" }), (0, jsx_runtime_1.jsx)("div", { className: "w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500" })] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onPrevious, className: "px-6 py-3 text-white/70 hover:text-white transition-colors", children: "Previous" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-x-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onSkip, className: "px-6 py-3 text-white/70 hover:text-white transition-colors", children: "Skip" }), (0, jsx_runtime_1.jsx)("button", { onClick: onNext, disabled: isLoading, className: "px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50", children: isLoading ? 'Loading...' : 'Complete Setup' })] })] })] }));
};
// Complete Step Component
const CompleteStep = ({ onNext, isLoading }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-6xl", children: "\uD83C\uDF89" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold text-white mb-4", children: "You're All Set!" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/80 max-w-md mx-auto", children: "Your personalized GamePilot experience is ready. Let's start exploring your gaming identity!" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 rounded-lg p-6 mb-8", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-white mb-4", children: "What's Next?" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3 text-left", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white/80", children: "Explore your personalized game recommendations" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDCDA" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white/80", children: "Organize your game library" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83E\uDD16" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white/80", children: "Discover your gaming personality" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAF" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white/80", children: "Connect your gaming platforms" })] })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onNext, disabled: isLoading, className: "px-12 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 text-lg font-semibold", children: isLoading ? 'Loading...' : 'Start Your Journey' })] }));
};
exports.default = exports.UserOnboarding;
