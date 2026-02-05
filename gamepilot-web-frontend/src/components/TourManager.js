"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourManager = exports.useTour = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// Interactive Help Tour System for GamePilot
const react_1 = require("react");
const react_dom_1 = require("react-dom");
// Predefined tour configurations
const tourConfigs = [
    {
        id: 'getting-started',
        name: 'Getting Started Tour',
        description: 'Learn the basics of GamePilot and set up your profile',
        showOnFirstVisit: true,
        steps: [
            {
                id: 'welcome',
                title: 'Welcome to GamePilot!',
                content: 'Let\'s take a quick tour to help you get started with your personalized gaming experience.',
                target: 'body',
                position: 'center',
                showProgress: true
            },
            {
                id: 'navigation',
                title: 'Navigation Menu',
                content: 'This is your main navigation. Access your library, discover games, view your gaming identity, and manage settings.',
                target: '[data-testid="main-navigation"]',
                position: 'bottom',
                showProgress: true
            },
            {
                id: 'home-dashboard',
                title: 'Your Dashboard',
                content: 'Your personalized dashboard shows mood-based recommendations, recent activity, and gaming stats.',
                target: '[data-testid="home-dashboard"]',
                position: 'right',
                showProgress: true
            },
            {
                id: 'mood-selector',
                title: 'Mood Selector',
                content: 'Choose how you\'re feeling to get personalized game recommendations that match your current mood.',
                target: '[data-testid="mood-selector"]',
                position: 'top',
                showProgress: true,
                validation: () => {
                    // Check if user has selected a mood
                    const selectedMood = document.querySelector('[data-testid="mood-selector"] .mood-button.selected');
                    return selectedMood !== null;
                }
            },
            {
                id: 'recommendations',
                title: 'Game Recommendations',
                content: 'Based on your mood, we\'ll suggest games you might enjoy. Click on any game to learn more about it.',
                target: '[data-testid="game-recommendations"]',
                position: 'left',
                showProgress: true
            },
            {
                id: 'library-access',
                title: 'Game Library',
                content: 'Access your complete game collection here. Import from Steam or add games manually.',
                target: '[data-testid="nav-library"]',
                position: 'bottom',
                showProgress: true
            },
            {
                id: 'profile-setup',
                title: 'Complete Your Profile',
                content: 'Add your gaming preferences and connect accounts to get better recommendations.',
                target: '[data-testid="nav-settings"]',
                position: 'bottom',
                showProgress: true
            },
            {
                id: 'tour-complete',
                title: 'Tour Complete!',
                content: 'You\'re all set! Explore GamePilot and discover your next favorite game. Help is always available in the settings.',
                target: 'body',
                position: 'center',
                showProgress: true
            }
        ]
    },
    {
        id: 'library-features',
        name: 'Library Features Tour',
        description: 'Learn how to manage and organize your game library',
        startCondition: () => {
            // Start tour when user first visits library
            return window.location.pathname === '/library';
        },
        steps: [
            {
                id: 'library-overview',
                title: 'Your Game Library',
                content: 'This is your complete game collection. Let\'s explore the features available.',
                target: '[data-testid="game-library"]',
                position: 'center',
                showProgress: true
            },
            {
                id: 'search-bar',
                title: 'Search Games',
                content: 'Search your library by title, genre, platform, or tags. Use advanced filters for precise results.',
                target: '[data-testid="game-search"]',
                position: 'bottom',
                showProgress: true
            },
            {
                id: 'filter-options',
                title: 'Filter Options',
                content: 'Filter your games by platform, genre, play status, or custom tags to find exactly what you\'re looking for.',
                target: '[data-testid="game-filters"]',
                position: 'left',
                showProgress: true
            },
            {
                id: 'sort-options',
                title: 'Sort Games',
                content: 'Sort your library by recently played, playtime, alphabetically, or custom criteria.',
                target: '[data-testid="game-sort"]',
                position: 'left',
                showProgress: true
            },
            {
                id: 'add-game',
                title: 'Add New Game',
                content: 'Add games to your library. Import from Steam, enter manually, or scan barcode.',
                target: '[data-testid="add-game-button"]',
                position: 'top',
                showProgress: true
            },
            {
                id: 'game-card',
                title: 'Game Cards',
                content: 'Each game card shows cover art, playtime, achievements, and status. Click to view details.',
                target: '[data-testid="game-card"]:first-child',
                position: 'right',
                showProgress: true
            },
            {
                id: 'bulk-actions',
                title: 'Bulk Actions',
                content: 'Select multiple games to perform bulk operations like tagging, status updates, or deletion.',
                target: '[data-testid="bulk-actions"]',
                position: 'top',
                showProgress: true
            }
        ]
    },
    {
        id: 'mood-engine-features',
        name: 'Mood Engine Tour',
        description: 'Learn how to use the mood engine for personalized recommendations',
        startCondition: () => {
            // Start when user interacts with mood selector
            return document.querySelector('[data-testid="mood-selector"]') !== null;
        },
        steps: [
            {
                id: 'mood-overview',
                title: 'Mood-Based Recommendations',
                content: 'The Mood Engine analyzes how you\'re feeling to suggest perfect games for your current state.',
                target: '[data-testid="mood-selector"]',
                position: 'top',
                showProgress: true
            },
            {
                id: 'mood-categories',
                title: 'Mood Categories',
                content: 'Choose from 8 different moods: Competitive, Chill, Story, Creative, Social, Focused, Energetic, or Exploratory.',
                target: '[data-testid="mood-selector"]',
                position: 'bottom',
                showProgress: true
            },
            {
                id: 'mood-history',
                title: 'Mood History',
                content: 'Track your mood patterns over time to understand your gaming habits and preferences.',
                target: '[data-testid="mood-history"]',
                position: 'left',
                showProgress: true
            },
            {
                id: 'recommendation-algorithm',
                title: 'How Recommendations Work',
                content: 'We analyze your mood, gaming history, and preferences to suggest games you\'ll love.',
                target: '[data-testid="recommendation-info"]',
                position: 'bottom',
                showProgress: true
            },
            {
                id: 'save-recommendations',
                title: 'Save for Later',
                content: 'Save games you\'re interested in to your wishlist or backlog to play later.',
                target: '[data-testid="save-recommendation"]',
                position: 'top',
                showProgress: true
            }
        ]
    },
    {
        id: 'integrations-tour',
        name: 'Integrations Tour',
        description: 'Learn how to connect your gaming accounts',
        startCondition: () => {
            // Start when user visits integrations page
            return window.location.pathname === '/integrations';
        },
        steps: [
            {
                id: 'integrations-overview',
                title: 'Connected Accounts',
                content: 'Enhance your GamePilot experience by connecting your gaming accounts.',
                target: '[data-testid="integrations-page"]',
                position: 'center',
                showProgress: true
            },
            {
                id: 'steam-integration',
                title: 'Steam Integration',
                content: 'Connect Steam to import your game library, track playtime, and sync achievements.',
                target: '[data-testid="steam-connect"]',
                position: 'right',
                showProgress: true
            },
            {
                id: 'discord-integration',
                title: 'Discord Integration',
                content: 'Connect Discord to show your gaming status and join communities.',
                target: '[data-testid="discord-connect"]',
                position: 'left',
                showProgress: true
            },
            {
                id: 'youtube-integration',
                title: 'YouTube Integration',
                content: 'Connect YouTube for gaming content recommendations and creator discovery.',
                target: '[data-testid="youtube-connect"]',
                position: 'right',
                showProgress: true
            },
            {
                id: 'privacy-settings',
                title: 'Privacy Controls',
                content: 'Control what data you share with each integration and manage permissions.',
                target: '[data-testid="privacy-controls"]',
                position: 'top',
                showProgress: true
            }
        ]
    }
];
// Tour Component
const Tour = () => {
    const [activeTour, setActiveTour] = (0, react_1.useState)(null);
    const [currentStepIndex, setCurrentStepIndex] = (0, react_1.useState)(0);
    const [isTourVisible, setIsTourVisible] = (0, react_1.useState)(false);
    const [tourPosition, setTourPosition] = (0, react_1.useState)({ top: 0, left: 0 });
    const [highlightElement, setHighlightElement] = (0, react_1.useState)(null);
    // TODO: Implement tour functionality
    // const startTour = useCallback((tourConfig: TourConfig) => {
    //   setActiveTour(tourConfig)
    //   setCurrentStepIndex(0)
    //   setIsTourVisible(true)
    // }, [])
    const endTour = (0, react_1.useCallback)(() => {
        setIsTourVisible(false);
        if (activeTour?.endAction) {
            activeTour.endAction();
        }
        setTimeout(() => {
            setActiveTour(null);
            setCurrentStepIndex(0);
            setHighlightElement(null);
        }, 300);
    }, [activeTour]);
    const nextStep = (0, react_1.useCallback)(() => {
        if (!activeTour)
            return;
        const currentStep = activeTour.steps[currentStepIndex];
        // Validate current step if validation exists
        if (currentStep.validation && !currentStep.validation()) {
            // Show validation message or prevent progression
            return;
        }
        if (currentStep.action) {
            currentStep.action();
        }
        if (currentStepIndex < activeTour.steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
        else {
            endTour();
        }
    }, [activeTour, currentStepIndex, endTour]);
    const previousStep = (0, react_1.useCallback)(() => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    }, [currentStepIndex]);
    const skipTour = (0, react_1.useCallback)(() => {
        endTour();
    }, [endTour]);
    const calculatePosition = (0, react_1.useCallback)(() => {
        if (!activeTour || !isTourVisible)
            return;
        const currentStep = activeTour.steps[currentStepIndex];
        const targetElement = document.querySelector(currentStep.target);
        if (!targetElement) {
            console.warn(`Tour target element not found: ${currentStep.target}`);
            return;
        }
        const rect = targetElement.getBoundingClientRect();
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        let top = 0;
        let left = 0;
        switch (currentStep.position) {
            case 'top':
                top = rect.top + scrollY - 120;
                left = rect.left + scrollX + (rect.width / 2) - 200;
                break;
            case 'bottom':
                top = rect.bottom + scrollY + 20;
                left = rect.left + scrollX + (rect.width / 2) - 200;
                break;
            case 'left':
                top = rect.top + scrollY + (rect.height / 2) - 60;
                left = rect.left + scrollX - 420;
                break;
            case 'right':
                top = rect.top + scrollY + (rect.height / 2) - 60;
                left = rect.right + scrollX + 20;
                break;
            case 'center':
                top = window.innerHeight / 2 - 100;
                left = window.innerWidth / 2 - 200;
                break;
        }
        // Adjust if tooltip goes out of viewport
        if (left < scrollX + 20) {
            left = scrollX + 20;
        }
        else if (left + 400 > scrollX + window.innerWidth - 20) {
            left = scrollX + window.innerWidth - 420;
        }
        if (top < scrollY + 20) {
            top = scrollY + 20;
        }
        else if (top + 200 > scrollY + window.innerHeight - 20) {
            top = scrollY + window.innerHeight - 220;
        }
        setTourPosition({ top, left });
        // Highlight target element
        if (currentStep.position !== 'center') {
            setHighlightElement(targetElement);
        }
        else {
            setHighlightElement(null);
        }
    }, [activeTour, currentStepIndex, isTourVisible]);
    (0, react_1.useEffect)(() => {
        if (isTourVisible) {
            calculatePosition();
        }
    }, [isTourVisible, calculatePosition]);
    (0, react_1.useEffect)(() => {
        const handleResize = () => {
            if (isTourVisible) {
                calculatePosition();
            }
        };
        const handleScroll = () => {
            if (isTourVisible) {
                calculatePosition();
            }
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isTourVisible, calculatePosition]);
    // Auto-start tours based on conditions
    (0, react_1.useEffect)(() => {
        // Don't start tours on login/register pages
        if (window.location.pathname === '/login' || window.location.pathname === '/register') {
            return;
        }
        tourConfigs.forEach(config => {
            if (config.showOnFirstVisit) {
                const hasSeenTour = localStorage.getItem(`tour-${config.id}-seen`);
                if (!hasSeenTour && (!config.startCondition || config.startCondition())) {
                    setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('startTour', { detail: config }));
                        localStorage.setItem(`tour-${config.id}-seen`, 'true');
                    }, 1000);
                }
            }
        });
    }, []);
    if (!activeTour || !isTourVisible)
        return null;
    const currentStep = activeTour.steps[currentStepIndex];
    const progress = ((currentStepIndex + 1) / activeTour.steps.length) * 100;
    const tourElement = (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 z-40", onClick: skipTour }), highlightElement && ((0, jsx_runtime_1.jsx)("div", { className: "absolute z-40 border-4 border-purple-500 rounded-lg pointer-events-none", style: {
                    top: `${highlightElement.getBoundingClientRect().top + window.scrollY - 4}px`,
                    left: `${highlightElement.getBoundingClientRect().left + window.scrollX - 4}px`,
                    width: `${highlightElement.getBoundingClientRect().width + 8}px`,
                    height: `${highlightElement.getBoundingClientRect().height + 8}px`,
                } })), (0, jsx_runtime_1.jsxs)("div", { className: "fixed z-50 bg-gray-900 text-white p-6 rounded-xl shadow-2xl border border-gray-700 max-w-md", style: {
                    top: `${tourPosition.top}px`,
                    left: `${tourPosition.left}px`,
                }, children: [currentStep.showProgress && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm text-gray-400 mb-2", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Step ", currentStepIndex + 1, " of ", activeTour.steps.length] }), (0, jsx_runtime_1.jsxs)("span", { children: [Math.round(progress), "%"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-700 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-purple-500 h-2 rounded-full transition-all duration-300", style: { width: `${progress}%` } }) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold mb-3", children: currentStep.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 leading-relaxed", children: currentStep.content })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [currentStepIndex > 0 && ((0, jsx_runtime_1.jsx)("button", { onClick: previousStep, className: "px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors", children: "Previous" })), currentStep.skipable !== false && ((0, jsx_runtime_1.jsx)("button", { onClick: skipTour, className: "px-4 py-2 text-gray-400 hover:text-white transition-colors", children: "Skip Tour" }))] }), (0, jsx_runtime_1.jsx)("button", { onClick: nextStep, className: "px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium", children: currentStepIndex === activeTour.steps.length - 1 ? 'Finish' : 'Next' })] }), (0, jsx_runtime_1.jsx)("button", { onClick: endTour, className: "absolute top-4 right-4 text-gray-400 hover:text-white transition-colors", "aria-label": "Close tour", title: "Close tour", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] })] }), document.body);
    return tourElement;
};
// Hook for managing tours
const useTour = () => {
    const startTour = (0, react_1.useCallback)((tourId) => {
        const tourConfig = tourConfigs.find(config => config.id === tourId);
        if (tourConfig) {
            // Trigger tour start by dispatching custom event
            window.dispatchEvent(new CustomEvent('startTour', { detail: tourConfig }));
        }
    }, []);
    const endTour = (0, react_1.useCallback)(() => {
        // Trigger tour end
        window.dispatchEvent(new CustomEvent('endTour'));
    }, []);
    const resetTourProgress = (0, react_1.useCallback)((tourId) => {
        localStorage.removeItem(`tour-${tourId}-seen`);
    }, []);
    const hasSeenTour = (0, react_1.useCallback)((tourId) => {
        return localStorage.getItem(`tour-${tourId}-seen`) === 'true';
    }, []);
    const getAvailableTours = (0, react_1.useCallback)(() => {
        return tourConfigs.map(config => ({
            id: config.id,
            name: config.name,
            description: config.description,
            hasSeen: hasSeenTour(config.id)
        }));
    }, [hasSeenTour]);
    return {
        startTour,
        endTour,
        resetTourProgress,
        hasSeenTour,
        getAvailableTours,
        tourConfigs
    };
};
exports.useTour = useTour;
// Tour Manager Component
const TourManager = () => {
    const [tourConfig, setTourConfig] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const handleStartTour = (event) => {
            setTourConfig(event.detail);
        };
        const handleEndTour = () => {
            setTourConfig(null);
        };
        window.addEventListener('startTour', handleStartTour);
        window.addEventListener('endTour', handleEndTour);
        return () => {
            window.removeEventListener('startTour', handleStartTour);
            window.removeEventListener('endTour', handleEndTour);
        };
    }, []);
    // Clear any existing tour on login/register pages for safety
    (0, react_1.useEffect)(() => {
        if (window.location.pathname === '/login' || window.location.pathname === '/register') {
            setTourConfig(null);
            // Also clear any stuck tour state
            window.dispatchEvent(new CustomEvent('endTour'));
        }
    }, []);
    if (!tourConfig)
        return null;
    return (0, jsx_runtime_1.jsx)(Tour, {});
};
exports.TourManager = TourManager;
exports.default = exports.TourManager;
