"use client;"

import { calculatePossibleScore } from "../game/game";


describe('calculatePossibleScore', () => {
    it('should return false for an empty array', () => {
        expect(calculatePossibleScore([])).toBe(false);
    });

    it('should return true for a straight (1-6)', () => {
        expect(calculatePossibleScore([1, 2, 3, 4, 5, 6])).toBe(true);
    });

    it('should return true for three pairs', () => {
        expect(calculatePossibleScore([2, 2, 3, 3, 4, 4])).toBe(true);
    });

    it('should return true for three 1s', () => {
        expect(calculatePossibleScore([1, 1, 1, 2, 3, 4])).toBe(true);
    });

    it('should return true for three 2s', () => {
        expect(calculatePossibleScore([2, 2, 2, 3, 4, 5])).toBe(true);
    });

    it('should return true for three 5s', () => {
        expect(calculatePossibleScore([5, 5, 5, 1, 2, 3])).toBe(true);
    });

    it('should return true for a single 1 and single 5', () => {
        expect(calculatePossibleScore([1, 5, 2, 3, 4, 6])).toBe(true);
    });

    it('should return false for no score', () => {
        expect(calculatePossibleScore([2, 3, 4, 6, 2, 3])).toBe(false);
    });
    
    it('should return true for 1,1,5,5,5,2', () => {
        expect(calculatePossibleScore([1,1,5,5,5,2])).toBe(true);
    });
    
    it('should return false for 2,2,3,4,6,7', () => {
        expect(calculatePossibleScore([2,2,3,4,6,7])).toBe(false);
    });
});
