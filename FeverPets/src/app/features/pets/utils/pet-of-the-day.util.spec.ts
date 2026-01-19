import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getDaySeed, calculatePetIdForToday } from './pet-of-the-day.util';

describe('pet-of-the-day.util', () => {
  describe('getDaySeed', () => {
    it('should return a positive number', () => {
      const seed = getDaySeed();
      expect(seed).toBeGreaterThan(0);
      expect(typeof seed).toBe('number');
    });

    it('should return the same seed for the same day', () => {
      const seed1 = getDaySeed();
      const seed2 = getDaySeed();
      expect(seed1).toBe(seed2);
    });
  });

  describe('calculatePetIdForToday', () => {
    it('should return a valid pet ID between 1 and totalPets', () => {
      const totalPets = 30;
      const petId = calculatePetIdForToday(totalPets);
      
      expect(petId).toBeGreaterThanOrEqual(1);
      expect(petId).toBeLessThanOrEqual(totalPets);
    });

    it('should return the same pet ID for the same day and total', () => {
      const totalPets = 30;
      const petId1 = calculatePetIdForToday(totalPets);
      const petId2 = calculatePetIdForToday(totalPets);
      
      expect(petId1).toBe(petId2);
    });

    it('should throw error for totalPets <= 0', () => {
      expect(() => calculatePetIdForToday(0)).toThrow('Total pets must be greater than 0');
      expect(() => calculatePetIdForToday(-1)).toThrow('Total pets must be greater than 0');
    });

    it('should handle different totalPets values', () => {
      const petId1 = calculatePetIdForToday(10);
      const petId2 = calculatePetIdForToday(20);
      
      expect(petId1).toBeGreaterThanOrEqual(1);
      expect(petId1).toBeLessThanOrEqual(10);
      expect(petId2).toBeGreaterThanOrEqual(1);
      expect(petId2).toBeLessThanOrEqual(20);
    });
  });
});
