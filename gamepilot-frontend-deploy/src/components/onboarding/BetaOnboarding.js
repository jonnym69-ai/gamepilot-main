"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetaOnboarding = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const Toast_1 = require("../Toast");
const BetaOnboarding = ({ onComplete, skipOnboarding }) => {
    const [currentStep, setCurrentStep] = (0, react_1.useState)(0);
    const [completedSteps, setCompletedSteps] = (0, react_1.useState)([]);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const onboardingSteps = [
        {
            id: 'welcome',
            title: 'Welcome to GamePilot Beta! 🎮',
            description: 'Thank you for joining our beta program! You\'re among the first to experience the future of game discovery.',
            content: ((0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83D\uDE80" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "GamePilot uses AI to understand your gaming mood and recommend the perfect games from your library." }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-900/30 border border-blue-500/30 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-blue-400 font-semibold mb-2", children: "Beta Features:" }), (0, jsx_runtime_1.jsxs)("ul", { className: "text-left text-sm space-y-1", children: [(0, jsx_runtime_1.jsx)("li", { children: "\u2728 Steam library integration" }), (0, jsx_runtime_1.jsx)("li", { children: "\uD83C\uDFAD Mood-based recommendations" }), (0, jsx_runtime_1.jsx)("li", { children: "\uD83D\uDCCA Gaming analytics dashboard" }), (0, jsx_runtime_1.jsx)("li", { children: "\uD83D\uDD17 Multi-platform support" })] })] })] }))
        },
        {
            id: 'steam-integration',
            title: 'Connect Your Steam Library 🎮',
            description: 'Import your Steam games to get personalized recommendations based on your gaming mood.',
            content: ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-5xl mb-4", children: "\uD83C\uDFAE" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-4", children: "Connect your Steam account to import your game library and unlock personalized recommendations." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-semibold mb-2", children: "Why connect Steam?" }), (0, jsx_runtime_1.jsxs)("ul", { className: "text-sm space-y-2 text-gray-300", children: [(0, jsx_runtime_1.jsx)("li", { children: "\u2022 Import your entire game library automatically" }), (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Get mood-based game recommendations" }), (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Track your gaming habits and patterns" }), (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Discover hidden gems in your collection" })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                            navigate('/library');
                            Toast_1.toast.info('Click "Import Steam" in your library to connect!');
                        }, className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors", children: "Connect Steam Library" })] }))
        },
        {
            id: 'mood-recommendations',
            title: 'Discover Games by Mood 🎭',
            description: 'Tell us how you feel and we\'ll recommend the perfect games for your current mood.',
            content: ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-5xl mb-4", children: "\uD83C\uDFAD" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-4", children: "Our AI analyzes your gaming preferences and current mood to suggest the perfect games." })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-3", children: [
                            { mood: 'Chill', emoji: '😌', color: 'bg-green-600' },
                            { mood: 'Competitive', emoji: '🔥', color: 'bg-red-600' },
                            { mood: 'Story', emoji: '📚', color: 'bg-purple-600' },
                            { mood: 'Creative', emoji: '🎨', color: 'bg-yellow-600' }
                        ].map(({ mood, emoji, color }) => ((0, jsx_runtime_1.jsxs)("div", { className: `${color} rounded-lg p-3 text-center`, children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl mb-1", children: emoji }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-semibold", children: mood })] }, mood))) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/recommendations'), className: "w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors", children: "Try Mood Recommendations" })] }))
        },
        {
            id: 'feedback',
            title: 'Help Us Improve! 📝',
            description: 'Your feedback is crucial for shaping the future of GamePilot.',
            content: ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-5xl mb-4", children: "\uD83D\uDCAC" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-4", children: "As a beta tester, your feedback helps us build the best game discovery platform." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-semibold mb-2", children: "Ways to provide feedback:" }), (0, jsx_runtime_1.jsxs)("ul", { className: "text-sm space-y-2 text-gray-300", children: [(0, jsx_runtime_1.jsx)("li", { children: "\u2022 Use the in-app feedback button" }), (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Report bugs and issues" }), (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Suggest new features" }), (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Share your experience on social media" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                    Toast_1.toast.info('Feedback button will be available in the app!');
                                }, className: "flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors", children: "Give Feedback" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.open('https://github.com/gamepilot/gamepilot/issues', '_blank'), className: "flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors", children: "Report Bug" })] })] }))
        },
        {
            id: 'complete',
            title: 'You\'re All Set! 🎉',
            description: 'Welcome to the GamePilot beta. Let\'s discover some amazing games!',
            content: ((0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83C\uDF89" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-white mb-2", children: "Beta Setup Complete!" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-6", children: "You're now ready to explore GamePilot. Here are some quick actions to get you started:" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/library'), className: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors", children: "\uD83D\uDCDA View My Library" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/recommendations'), className: "bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors", children: "\uD83C\uDFAD Get Recommendations" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/analytics'), className: "bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors", children: "\uD83D\uDCCA View Analytics" })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 p-4 bg-yellow-900/30 border border-yellow-500/30 rounded-lg", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-yellow-400 text-sm", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Beta Tip:" }), " Check back regularly for new features and improvements!"] }) })] }))
        }
    ];
    (0, react_1.useEffect)(() => {
        if (skipOnboarding) {
            onComplete();
            return;
        }
    }, [skipOnboarding, onComplete]);
    const handleNext = () => {
        const currentStepId = onboardingSteps[currentStep].id;
        if (!completedSteps.includes(currentStepId)) {
            setCompletedSteps([...completedSteps, currentStepId]);
        }
        if (currentStep < onboardingSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
        else {
            onComplete();
            Toast_1.toast.success('Welcome to GamePilot Beta! 🎮');
        }
    };
    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    const handleSkip = () => {
        onComplete();
        Toast_1.toast.info('Onboarding skipped. You can always access it later!');
    };
    if (skipOnboarding) {
        return null;
    }
    const currentStepData = onboardingSteps[currentStep];
    const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-2xl w-full", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-400", children: ["Step ", currentStep + 1, " of ", onboardingSteps.length] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-400", children: [Math.round(progress), "%"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-blue-600 h-2 rounded-full transition-all duration-300", style: { width: `${progress}%` } }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold text-white mb-2", children: currentStepData.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: currentStepData.description })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-8", children: currentStepData.content }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [currentStep > 0 && ((0, jsx_runtime_1.jsx)("button", { onClick: handlePrevious, className: "px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors", children: "Previous" })), (0, jsx_runtime_1.jsx)("button", { onClick: handleSkip, className: "px-6 py-3 text-gray-400 hover:text-white font-semibold transition-colors", children: "Skip Onboarding" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleNext, className: "flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors", children: currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next' })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 text-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-yellow-900/30 border border-yellow-500/30 rounded-full", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-yellow-400 text-sm font-semibold", children: "BETA" }), (0, jsx_runtime_1.jsx)("span", { className: "text-yellow-400 text-sm", children: "v1.0" })] }) })] }) }));
};
exports.BetaOnboarding = BetaOnboarding;
