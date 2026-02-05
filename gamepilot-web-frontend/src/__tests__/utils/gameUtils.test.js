"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Unit tests for game utilities
const gameUtils_1 = require("../../../packages/shared/src/utils/gameUtils");
describe('Game Utilities', () => {
    describe('getPlatformColor', () => {
        it('should return correct color for Steam', () => {
            const result = (0, gameUtils_1.getPlatformColor)('steam');
            expect(result).toBe('#1B2838');
        });
        it('should return correct color for Xbox', () => {
            const result = (0, gameUtils_1.getPlatformColor)('xbox');
            expect(result).toBe('#107C10');
        });
        it('should return correct color for PlayStation', () => {
            const result = (0, gameUtils_1.getPlatformColor)('playstation');
            expect(result).toBe('#003791');
        });
        it('should return correct color for Nintendo', () => {
            const result = (0, gameUtils_1.getPlatformColor)('nintendo');
            expect(result).toBe('#E60012');
        });
        it('should return correct color for Epic Games', () => {
            const result = (0, gameUtils_1.getPlatformColor)('epic');
            expect(result).toBe('#313131');
        });
        it('should return correct color for GOG', () => {
            const result = (0, gameUtils_1.getPlatformColor)('gog');
            expect(result).toBe('#8B46FF');
        });
        it('should return correct color for Origin', () => {
            const result = (0, gameUtils_1.getPlatformColor)('origin');
            expect(result).toBe('#F56B00');
        });
        it('should return correct color for Ubisoft Connect', () => {
            const result = (0, gameUtils_1.getPlatformColor)('uplay');
            expect(result).toBe('#00B4D3');
        });
        it('should return correct color for Battle.net', () => {
            const result = (0, gameUtils_1.getPlatformColor)('battlenet');
            expect(result).toBe('#1A5CAD');
        });
        it('should return correct color for Discord', () => {
            const result = (0, gameUtils_1.getPlatformColor)('discord');
            expect(result).toBe('#5865F2');
        });
        it('should return correct color for Itch.io', () => {
            const result = (0, gameUtils_1.getPlatformColor)('itch');
            expect(result).toBe('#FA5C5C');
        });
        it('should return correct color for Humble Bundle', () => {
            const result = (0, gameUtils_1.getPlatformColor)('humble');
            expect(result).toBe('#CB772D');
        });
        it('should return correct color for YouTube', () => {
            const result = (0, gameUtils_1.getPlatformColor)('youtube');
            expect(result).toBe('#FF0000');
        });
        it('should return default color for custom platform', () => {
            const result = (0, gameUtils_1.getPlatformColor)('custom');
            expect(result).toBe('#6B7280');
        });
        it('should return default color for unknown platform', () => {
            const result = (0, gameUtils_1.getPlatformColor)('unknown');
            expect(result).toBe('#6B7280');
        });
    });
    describe('getPlatformName', () => {
        it('should return correct name for Steam', () => {
            const result = (0, gameUtils_1.getPlatformName)('steam');
            expect(result).toBe('Steam');
        });
        it('should return correct name for Xbox', () => {
            const result = (0, gameUtils_1.getPlatformName)('xbox');
            expect(result).toBe('Xbox');
        });
        it('should return correct name for PlayStation', () => {
            const result = (0, gameUtils_1.getPlatformName)('playstation');
            expect(result).toBe('PlayStation');
        });
        it('should return correct name for Nintendo', () => {
            const result = (0, gameUtils_1.getPlatformName)('nintendo');
            expect(result).toBe('Nintendo');
        });
        it('should return correct name for Epic Games', () => {
            const result = (0, gameUtils_1.getPlatformName)('epic');
            expect(result).toBe('Epic Games');
        });
        it('should return correct name for GOG', () => {
            const result = (0, gameUtils_1.getPlatformName)('gog');
            expect(result).toBe('GOG');
        });
        it('should return correct name for Origin', () => {
            const result = (0, gameUtils_1.getPlatformName)('origin');
            expect(result).toBe('Origin');
        });
        it('should return correct name for Ubisoft Connect', () => {
            const result = (0, gameUtils_1.getPlatformName)('uplay');
            expect(result).toBe('Ubisoft Connect');
        });
        it('should return correct name for Battle.net', () => {
            const result = (0, gameUtils_1.getPlatformName)('battlenet');
            expect(result).toBe('Battle.net');
        });
        it('should return correct name for Discord', () => {
            const result = (0, gameUtils_1.getPlatformName)('discord');
            expect(result).toBe('Discord');
        });
        it('should return correct name for Itch.io', () => {
            const result = (0, gameUtils_1.getPlatformName)('itch');
            expect(result).toBe('Itch.io');
        });
        it('should return correct name for Humble Bundle', () => {
            const result = (0, gameUtils_1.getPlatformName)('humble');
            expect(result).toBe('Humble Bundle');
        });
        it('should return correct name for YouTube', () => {
            const result = (0, gameUtils_1.getPlatformName)('youtube');
            expect(result).toBe('YouTube');
        });
        it('should return default name for custom platform', () => {
            const result = (0, gameUtils_1.getPlatformName)('custom');
            expect(result).toBe('Other');
        });
        it('should return default name for unknown platform', () => {
            const result = (0, gameUtils_1.getPlatformName)('unknown');
            expect(result).toBe('Other');
        });
    });
});
