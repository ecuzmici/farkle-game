"use client;";

import { calculateScore } from "../game/game";


describe('calculateScore', () => {
  it('should return 1500 for a full straight (1-6)', () => {
    expect(calculateScore([1, 2, 3, 4, 5, 6])).toBe(1500);
  });

  it('should return 500 for a partial straight (1-5)', () => {
    expect(calculateScore([1, 2, 3, 4, 5])).toBe(500);
  });

  it('should return 750 for a partial straight (2-6)', () => {
    expect(calculateScore([2, 3, 4, 5, 6])).toBe(750);
  });

  it('should return 1000 for three ones', () => {
    expect(calculateScore([1, 1, 1])).toBe(1000);
  });

  it('should return 0', () => {
    expect(calculateScore([1, 1, 1, 5, 5, 2])).toBe(0);
  });

  it('should return 1100 for three ones and two fives', () => {
    expect(calculateScore([1, 1, 1, 5, 5])).toBe(1100);
  });

  it('should return 200 for three twos', () => {
    expect(calculateScore([2, 2, 2])).toBe(200);
  });

  it('should return 300 for three threes', () => {
    expect(calculateScore([3, 3, 3])).toBe(300);
  });

  it('should return correct score for four of a kind (e.g., four fours)', () => {
    expect(calculateScore([4, 4, 4, 4])).toBe(800); // Double the score of three fours
    expect(calculateScore([1, 1, 1, 1])).toBe(2000); // Double the score of three ones
  });

  it('should return correct score for five of a kind (e.g., five fives)', () => {
    expect(calculateScore([5, 5, 5, 5, 5])).toBe(2000); // Double the score of four fives
    expect(calculateScore([6, 6, 6, 6, 6])).toBe(2400); // Double the score of four sixes
    expect(calculateScore([1, 1, 1, 1, 1])).toBe(4000); // Double the score of four ones
  });

  it('should return correct score for six of a kind', () => {
    expect(calculateScore([2, 2, 2, 2, 2, 2])).toBe(1600); // Double the score of five twos
    expect(calculateScore([1, 1, 1, 1, 1, 1])).toBe(8000); // Double the score of five ones

  });
})

