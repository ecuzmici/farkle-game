"use client;"

import { calculateScore } from "../game/game";


describe('calculateScore', () => {
    it('should return 0 for an empty array', () => {
        expect(calculateScore([])).toBe(0);
    });

    it('should return 1500 for a straight (1-6)', () => {
        expect(calculateScore([1, 2, 3, 4, 5, 6])).toBe(1500);
    });

    it('should return 1500 for three pairs', () => {
        expect(calculateScore([2, 2, 3, 3, 4, 4])).toBe(1500);
    });

    it('should return 2500 for two triplets', () => {
        expect(calculateScore([2, 2, 2, 3, 3, 3])).toBe(2500);
    });

    it('should return 1000 for three 1s', () => {
        expect(calculateScore([1, 1, 1, 2, 3, 4])).toBe(1000);
    });

    it('should return 200 for three 2s', () => {
        expect(calculateScore([2, 2, 2, 3, 4, 4])).toBe(200);
    });

    it('should return 500 for three 5s', () => {
        expect(calculateScore([5, 5, 5, 2, 2, 3])).toBe(500);
    });

    it('should return 150 for a single 1 and single 5', () => {
        expect(calculateScore([1, 5, 3, 3, 4, 6])).toBe(150);
    });

    it('should return 0 for no score', () => {
        expect(calculateScore([2, 3, 4, 6, 2, 3])).toBe(0);
    });

    it('should return 700 for three 5s and 2 single 1s', () => {
        expect(calculateScore([1, 1, 5, 5, 5, 2])).toBe(700);
    });
    
    it('should return 1200 for three 1s and three 5s', () => {
      expect(calculateScore([5, 1, 5, 1, 5, 1])).toBe(1200);
    });

    it('should return 1500 for four of a kind + a pair', () => {
      expect(calculateScore([3, 3, 3, 3, 4, 4])).toBe(1500);
    });
});
