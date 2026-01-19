import { describe, it, expect } from 'vitest';
import { calculateHealth, getHealthBadgeInfo } from './pet-health.util';
import { Pet, HealthStatus } from '@features/pets/models';

describe('pet-health.util', () => {
  describe('calculateHealth', () => {
    it('should return unhealthy for cat with 1 life', () => {
      const pet: Pet = {
        id: 1,
        name: 'Test Cat',
        kind: 'Cat',
        weight: 4.5,
        height: 25,
        length: 30,
        photo_url: '',
        description: '',
        number_of_lives: 1
      };

      expect(calculateHealth(pet)).toBe('unhealthy');
    });

    it('should return very healthy for ratio between 2 and 3', () => {
      const pet: Pet = {
        id: 1,
        name: 'Test Pet',
        kind: 'Dog',
        weight: 125, // 125 / (10 * 5) = 2.5 (between 2 and 3)
        height: 10,
        length: 5,
        photo_url: '',
        description: ''
      };

      expect(calculateHealth(pet)).toBe('very healthy');
    });

    it('should return healthy for ratio between 3 and 5', () => {
      const pet: Pet = {
        id: 1,
        name: 'Test Pet',
        kind: 'Dog',
        weight: 200, // 200 / (10 * 5) = 4
        height: 10,
        length: 5,
        photo_url: '',
        description: ''
      };

      expect(calculateHealth(pet)).toBe('healthy');
    });

    it('should return unhealthy for ratio below 2', () => {
      const pet: Pet = {
        id: 1,
        name: 'Test Pet',
        kind: 'Dog',
        weight: 50, // 50 / (10 * 5) = 1
        height: 10,
        length: 5,
        photo_url: '',
        description: ''
      };

      expect(calculateHealth(pet)).toBe('unhealthy');
    });

    it('should return unhealthy for ratio above 5', () => {
      const pet: Pet = {
        id: 1,
        name: 'Test Pet',
        kind: 'Dog',
        weight: 300, // 300 / (10 * 5) = 6
        height: 10,
        length: 5,
        photo_url: '',
        description: ''
      };

      expect(calculateHealth(pet)).toBe('unhealthy');
    });
  });

  describe('getHealthBadgeInfo', () => {
    it('should return correct info for very healthy status', () => {
      const info = getHealthBadgeInfo('very healthy');
      expect(info.status).toBe('very healthy');
      expect(info.cssClasses).toBe('bg-green-100 text-green-800');
      expect(info.translationKey).toBe('PETS.HEALTH.VERY_HEALTHY');
    });

    it('should return correct info for healthy status', () => {
      const info = getHealthBadgeInfo('healthy');
      expect(info.status).toBe('healthy');
      expect(info.cssClasses).toBe('bg-blue-100 text-blue-800');
      expect(info.translationKey).toBe('PETS.HEALTH.HEALTHY');
    });

    it('should return correct info for unhealthy status', () => {
      const info = getHealthBadgeInfo('unhealthy');
      expect(info.status).toBe('unhealthy');
      expect(info.cssClasses).toBe('bg-red-100 text-red-800');
      expect(info.translationKey).toBe('PETS.HEALTH.UNHEALTHY');
    });
  });
});
