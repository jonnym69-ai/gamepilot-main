"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
require("@testing-library/jest-dom");
const GameCard_1 = require("../../features/library/components/GameCard");
const ErrorBoundary_1 = require("../../components/ErrorBoundary");
const types_1 = require("@gamepilot/types");
// Mock the stores
jest.mock('../../../stores/useLibraryStore', () => ({
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
jest.mock('../../../stores/useGamePilotStore', () => ({
    __esModule: true,
    useGamePilotStore: jest.fn(() => ({
        integrations: {
            steam: { connected: false },
            discord: { connected: false },
            youtube: { connected: false }
        }
    }))
}));
describe('GameCard Component', () => {
    const mockGame = {
        id: '1',
        title: 'Test Game',
        coverImage: '/test-cover.jpg',
        genres: [
            { id: 'action', name: 'Action', color: '#FF6B6B', subgenres: [] },
            { id: 'rpg', name: 'RPG', color: '#10B981', subgenres: [] }
        ],
        subgenres: [],
        platforms: [
            { id: 'steam', name: 'Steam', code: types_1.PlatformCode.STEAM, isConnected: false }
        ],
        emotionalTags: [],
        playStatus: 'unplayed',
        hoursPlayed: 0,
        userRating: 0,
        isFavorite: false,
        tags: ['test', 'sample'],
        addedAt: new Date(),
        releaseYear: 2023
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should render game card correctly', () => {
        const { useLibraryStore } = require('../../../stores/useLibraryStore');
        useLibraryStore.mockReturnValueOnce({
            games: [mockGame],
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
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(GameCard_1.GameCard, { game: mockGame }) }));
        expect(react_1.screen.getByText('Test Game')).toBeInTheDocument();
        expect(react_1.screen.getByAltText('Test Game')).toBeInTheDocument();
        expect(react_1.screen.getByText('Action')).toBeInTheDocument();
        expect(react_1.screen.getByText('RPG')).toBeInTheDocument();
    });
    it('should handle click events', () => {
        const { useLibraryStore } = require('../../../stores/useLibraryStore');
        const mockUpdateGameStatus = jest.fn();
        useLibraryStore.mockReturnValueOnce({
            games: [mockGame],
            currentSession: null,
            actions: {
                addGame: jest.fn(),
                updateGame: mockUpdateGameStatus,
                removeGame: jest.fn(),
                updateGameStatus: jest.fn(),
                updateGamePlaytime: jest.fn(),
                setIntelligenceState: jest.fn()
            }
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(GameCard_1.GameCard, { game: mockGame }) }));
        const card = react_1.screen.getByTestId('game-card-1');
        // Test click on card
        react_1.fireEvent.click(card);
        // Should call updateGameStatus
        expect(mockUpdateGameStatus).toHaveBeenCalledWith('1', 'playing');
    });
    it('should display play status', () => {
        const { useLibraryStore } = require('../../../stores/useLibraryStore');
        useLibraryStore.mockReturnValueOnce({
            games: [mockGame],
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
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(GameCard_1.GameCard, { game: mockGame }) }));
        expect(react_1.screen.getByText('Unplayed')).toBeInTheDocument();
    });
    it('should display hours played', () => {
        const { useLibraryStore } = require('../../../stores/useLibraryStore');
        useLibraryStore.mockReturnValueOnce({
            games: [mockGame],
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
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(GameCard_1.GameCard, { game: mockGame }) }));
        expect(react_1.screen.getByText('0 hours played')).toBeInTheDocument();
    });
    it('should display rating', () => {
        const { useLibraryStore } = require('../../../stores/useLibraryStore');
        useLibraryStore.mockReturnValueOnce({
            games: [mockGame],
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
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(GameCard_1.GameCard, { game: mockGame }) }));
        expect(react_1.screen.getByText('Not Rated')).toBeInTheDocument();
    });
    it('should display tags', () => {
        const { useLibraryStore } = require('../../../stores/useLibraryStore');
        useLibraryStore.mockReturnValueOnce({
            games: [mockGame],
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
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(GameCard_1.GameCard, { game: mockGame }) }));
        expect(react_1.screen.getByText('test')).toBeInTheDocument();
        expect(react_1.screen.getByText('sample')).toBeInTheDocument();
    });
    it('should display favorite status', () => {
        const { useLibraryStore } = require('../../../stores/useLibraryStore');
        useLibraryStore.mockReturnValueOnce({
            games: [mockGame],
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
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(GameCard_1.GameCard, { game: mockGame }) }));
        expect(react_1.screen.getByText('Not Favorite')).toBeInTheDocument();
    });
    it('should be accessible', () => {
        const { useLibraryStore } = require('../../../stores/useLibraryStore');
        useLibraryStore.mockReturnValueOnce({
            games: [mockGame],
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
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(GameCard_1.GameCard, { game: mockGame }) }));
        // Test keyboard navigation
        const card = react_1.screen.getByTestId('game-card-1');
        user_event_1.default.tab(card);
        expect(card).toHaveFocus();
    });
    it('should handle loading state', () => {
        const { useLibraryStore } = require('../../../stores/useLibraryStore');
        useLibraryStore.mockReturnValueOnce({
            games: [mockGame],
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
        (0, react_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.PageErrorBoundary, { children: (0, jsx_runtime_1.jsx)(GameCard_1.GameCard, { game: mockGame }) }));
        expect(react_1.screen.getByText('Test Game')).toBeInTheDocument();
        expect(react_1.screen.getByText('Loading…')).toBeInTheDocument();
    });
});
