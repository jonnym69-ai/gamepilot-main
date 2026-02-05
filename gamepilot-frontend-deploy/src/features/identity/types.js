"use strict";
// Identity Types - Now using canonical models from shared package
// This file contains only frontend-specific extensions and constants
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOODS = exports.GENRES = exports.PLAYSTYLES = void 0;
// ============================================================================
// FRONTEND CONSTANTS (Keep - these are UI-specific)
// ============================================================================
exports.PLAYSTYLES = [
    {
        id: 'explorer',
        name: 'Explorer',
        description: 'Loves discovering new worlds and secrets',
        icon: '🗺️',
        color: 'from-green-500 to-emerald-600',
        traits: ['curious', 'thorough', 'patient']
    },
    {
        id: 'achiever',
        name: 'Achiever',
        description: 'Driven by completing challenges and earning rewards',
        icon: '🏆',
        color: 'from-yellow-500 to-orange-600',
        traits: ['competitive', 'dedicated', 'goal-oriented']
    },
    {
        id: 'storyteller',
        name: 'Storyteller',
        description: 'Values narrative and emotional experiences',
        icon: '📚',
        color: 'from-purple-500 to-pink-600',
        traits: ['imaginative', 'empathetic', 'reflective']
    },
    {
        id: 'competitor',
        name: 'Competitor',
        description: 'Thrives on challenge and competition',
        icon: '⚔️',
        color: 'from-red-500 to-rose-600',
        traits: ['aggressive', 'strategic', 'focused']
    },
    {
        id: 'creator',
        name: 'Creator',
        description: 'Enjoys building, customizing, and expressing creativity',
        icon: '🎨',
        color: 'from-blue-500 to-indigo-600',
        traits: ['creative', 'innovative', 'expressive']
    },
    {
        id: 'socializer',
        name: 'Socializer',
        description: 'Values community and multiplayer experiences',
        icon: '👥',
        color: 'from-teal-500 to-cyan-600',
        traits: ['outgoing', 'cooperative', 'friendly']
    }
];
exports.GENRES = [
    { id: 'action', name: 'Action', tags: ['fast-paced', 'exciting'] },
    { id: 'adventure', name: 'Adventure', tags: ['exploration', 'story'] },
    { id: 'rpg', name: 'RPG', tags: ['character progression', 'story'] },
    { id: 'strategy', name: 'Strategy', tags: ['tactical', 'planning'] },
    { id: 'simulation', name: 'Simulation', tags: ['realistic', 'detailed'] },
    { id: 'sports', name: 'Sports', tags: ['competitive', 'athletic'] },
    { id: 'racing', name: 'Racing', tags: ['speed', 'competition'] },
    { id: 'puzzle', name: 'Puzzle', tags: ['brain-teaser', 'logic'] },
    { id: 'platformer', name: 'Platformer', tags: ['precision', 'jumping'] },
    { id: 'fps', name: 'FPS', tags: ['shooting', 'first-person'] },
    { id: 'moba', name: 'MOBA', tags: ['team-based', 'competitive'] },
    { id: 'roguelike', name: 'Roguelike', tags: ['procedural', 'challenging'] },
    { id: 'horror', name: 'Horror', tags: ['scary', 'suspenseful'] },
    { id: 'indie', name: 'Indie', tags: ['unique', 'creative'] },
    { id: 'casual', name: 'Casual', tags: ['relaxing', 'accessible'] }
];
exports.MOODS = [
    {
        id: 'relaxed',
        name: 'Relaxed',
        emoji: '😌',
        color: 'from-green-500 to-teal-500',
        associatedGenres: ['simulation', 'puzzle', 'casual']
    },
    {
        id: 'energetic',
        name: 'Energetic',
        emoji: '⚡',
        color: 'from-yellow-500 to-orange-500',
        associatedGenres: ['action', 'racing', 'sports']
    },
    {
        id: 'focused',
        name: 'Focused',
        emoji: '🎯',
        color: 'from-blue-500 to-indigo-500',
        associatedGenres: ['strategy', 'puzzle', 'rpg']
    },
    {
        id: 'creative',
        name: 'Creative',
        emoji: '🎨',
        color: 'from-purple-500 to-pink-500',
        associatedGenres: ['simulation', 'indie', 'adventure']
    },
    {
        id: 'competitive',
        name: 'Competitive',
        emoji: '🏆',
        color: 'from-red-500 to-rose-500',
        associatedGenres: ['fps', 'moba', 'sports', 'fighting']
    },
    {
        id: 'social',
        name: 'Social',
        emoji: '👥',
        color: 'from-cyan-500 to-blue-500',
        associatedGenres: ['moba', 'mmorpg', 'party']
    },
    {
        id: 'nostalgic',
        name: 'Nostalgic',
        emoji: '📻',
        color: 'from-amber-500 to-yellow-500',
        associatedGenres: ['retro', 'platformer', 'indie']
    },
    {
        id: 'adventurous',
        name: 'Adventurous',
        emoji: '🗺️',
        color: 'from-emerald-500 to-green-500',
        associatedGenres: ['adventure', 'rpg', 'exploration']
    }
];
