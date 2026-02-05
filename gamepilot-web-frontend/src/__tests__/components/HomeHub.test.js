"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
const HomeHubFinal_1 = require("../../features/home/HomeHubFinal");
const ErrorBoundary_1 = require("../../components/ErrorBoundary");
// Mock the stores
jest.mock('../../stores/useLibraryStore', () => ({
    useLibraryStore: jest.fn(() => ({
        games: [],
        currentSession: null,
        actions: {
            addGame: jest.fn(),
            updateGame: jest.fn(),
            removeGame: jest.fn(),
            updateGameStatus: jest.fn(),
            updateGamePlaytime: jest.fn(),
            setIntelligenceState: jest.fn()
        }
    }))
}));
jest.mock('../../stores/useGamePilotStore', () => ({
    useGamePilotStore: jest.fn(() => ({
        integrations: {
            steam: { connected: false },
            discord: { connected: false },
            youtube: { connected: false }
        },
    }))
}));
jest.mock('../../store/authStore', () => ({
    useAuthStore: jest.fn(() => ({
        user: {
            id: '1',
            username: 'testuser',
            displayName: 'Test User',
            avatar: 'test-avatar.jpg'
        },
        isAuthenticated: true,
        isLoading: false,
        error: null
    }))
}));
describe('HomeHub Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should render without crashing', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(HomeHubFinal_1.HomeHub, {}) }));
        expect(react_1.screen.getByText('Welcome back, Gamer')).toBeInTheDocument();
        expect(react_1.screen.getByText('Your gaming universe at a glance')).toBeInTheDocument();
    });
    it('should display integrations section', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(HomeHubFinal_1.HomeHub, {}) }));
        expect(react_1.screen.getByText('Integrations')).toBeInTheDocument();
        expect(react_1.screen.getByText('Steam')).toBeInTheDocument();
        expect(react_1.screen.getByText('Discord')).toBeInTheDocument();
        expect(react_1.screen.getByText('YouTube')).toBeInTheDocument();
        expect(react_1.screen.getByText('Twitch')).toBeInTheDocument();
    });
    it('should display recently played section', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(HomeHubFinal_1.HomeHub, {}) }));
        expect(react_1.screen.getByText('Recently Played')).toBeInTheDocument();
        expect(react_1.screen.getByText('No recently played games yet. Start playing some games to see them here!')).toBeInTheDocument();
    });
    it('should display recommendations section', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(HomeHubFinal_1.HomeHub, {}) }));
        expect(react_1.screen.getByText('Recommended for You')).toBeInTheDocument();
        expect(react_1.screen.getByText('Try something atmospheric')).toBeInTheDocument();
        expect(react_1.screen.getByText('Games with strong narrative')).toBeInTheDocument();
        expect(react_1.screen.getByText('Fast-paced action picks')).toBeInTheDocument();
    });
    it('should handle empty user data gracefully', () => {
        const { useAuthStore } = require('../../store/authStore');
        useAuthStore.mockReturnValueOnce({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(HomeHubFinal_1.HomeHub, {}) }));
        expect(react_1.screen.getByText('Welcome back, Gamer')).toBeInTheDocument();
        expect(react_1.screen.getByText('Your gaming universe at a glance')).toBeInTheDocument();
    });
    it('should handle empty games data gracefully', () => {
        const { useLibraryStore } = require('../../stores/useLibraryStore');
        useLibraryStore.mockReturnValueOnce({
            games: [],
            currentSession: null,
            actions: {
                addGame: jest.fn(),
                updateGame: jest.fn(),
                removeGame: jest.fn(),
                updateGameStatus: jest.fn(),
                updateGamePlaytime: jest.fn(),
                setIntelligenceState: jest.fn()
            }
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(HomeHubFinal_1.HomeHub, {}) }));
        expect(react_1.screen.getByText('No recently played games yet. Start playing some games to see them here!')).toBeInTheDocument();
    });
    it('should handle loading states', async () => {
        const { useAuthStore } = require('../../store/authStore');
        useAuthStore.mockReturnValueOnce({
            user: null,
            isAuthenticated: true,
            isLoading: true,
            error: null
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(HomeHubFinal_1.HomeHub, {}) }));
        expect(react_1.screen.getByText('Loading your dashboard…')).toBeInTheDocument();
        await (0, react_1.waitFor)(() => {
            expect(react_1.screen.queryByText('Loading your dashboard…')).not.toBeInTheDocument();
            expect(react_1.screen.getByText('Welcome back, Gamer')).toBeInTheDocument();
        });
    });
    it('should handle error states', () => {
        const { useAuthStore } = require('../../store/authStore');
        useAuthStore.mockReturnValueOnce({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Failed to load user data'
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(HomeHubFinal_1.HomeHub, {}) }));
        expect(react_1.screen.getByText('Home Hub Error')).toBeInTheDocument();
        expect(react_1.screen.getByText('Failed to load user data')).toBeInTheDocument();
        expect(react_1.screen.getByText('Try Again')).toBeInTheDocument();
    });
    it('should be accessible', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(HomeHubFinal_1.HomeHub, {}) }));
        // Test keyboard navigation
        const user = react_1.screen.getByRole('button', { name: /integrations/i });
        user_event_1.default.tab(user);
        expect(react_1.screen.getByRole('button', { name: /recently played/i })).toBeInTheDocument();
        user_event_1.default.tab(react_1.screen.getByRole('button', { name: /recommended/i }));
        // Test ARIA labels
        expect(react_1.screen.getByLabelText('Steam integration')).toBeInTheDocument();
        expect(react_1.screen.getByLabelText('Discord integration')).toBeInTheDocument();
        expect(react_1.screen.getByLabelText('YouTube integration')).toBeInTheDocument();
    });
    it('should be responsive', () => {
        // Test mobile viewport
        Object.defineProperty(window, 'innerWidth', {
            value: 375,
            configurable: true
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(HomeHubFinal_1.HomeHub, {}) }));
        // Should adapt layout for mobile
        expect(react_1.screen.getByText('Integrations')).toBeInTheDocument();
        expect(react_1.screen.getByText('Steam')).toBeInTheDocument();
    });
});
