import { describe, it, expect, beforeEach } from 'vitest';
import { HealthRuleFactory } from './health-rule.factory';
import { CatHealthRule } from './cat-health.rule';
import { DefaultHealthRule } from './default-health.rule';
import { Pet } from '@features/pets/models';

describe('HealthRuleFactory', () => {
  let factory: HealthRuleFactory;

  beforeEach(() => {
    factory = new HealthRuleFactory();
  });

  describe('getRule', () => {
    it('should return CatHealthRule for cats', () => {
      const cat: Pet = {
        id: 1,
        name: 'Fluffy',
        kind: 'Cat',
        weight: 4.5,
        height: 25,
        length: 30,
        photo_url: '',
        description: '',
        number_of_lives: 7
      };

      const rule = factory.getRule(cat);
      expect(rule).toBeInstanceOf(CatHealthRule);
    });

    it('should return DefaultHealthRule for dogs', () => {
      const dog: Pet = {
        id: 1,
        name: 'Buddy',
        kind: 'Dog',
        weight: 20,
        height: 30,
        length: 40,
        photo_url: '',
        description: ''
      };

      const rule = factory.getRule(dog);
      expect(rule).toBeInstanceOf(DefaultHealthRule);
    });

    it('should return DefaultHealthRule for unknown pet types', () => {
      const bird: Pet = {
        id: 1,
        name: 'Tweety',
        kind: 'Bird',
        weight: 0.5,
        height: 10,
        length: 15,
        photo_url: '',
        description: ''
      };

      const rule = factory.getRule(bird);
      expect(rule).toBeInstanceOf(DefaultHealthRule);
    });
  });

  describe('calculateHealth', () => {
    it('should return unhealthy for cat with 1 life', () => {
      const cat: Pet = {
        id: 1,
        name: 'Fluffy',
        kind: 'Cat',
        weight: 4.5,
        height: 25,
        length: 30,
        photo_url: '',
        description: '',
        number_of_lives: 1
      };

      expect(factory.calculateHealth(cat)).toBe('unhealthy');
    });

    it('should use default calculation for cat with multiple lives', () => {
      const cat: Pet = {
        id: 1,
        name: 'Fluffy',
        kind: 'Cat',
        weight: 125, // 125 / (10 * 5) = 2.5 (between 2 and 3)
        height: 10,
        length: 5,
        photo_url: '',
        description: '',
        number_of_lives: 7
      };

      expect(factory.calculateHealth(cat)).toBe('very healthy');
    });

    it('should use default calculation for dogs', () => {
      const dog: Pet = {
        id: 1,
        name: 'Buddy',
        kind: 'Dog',
        weight: 200, // 200 / (10 * 5) = 4
        height: 10,
        length: 5,
        photo_url: '',
        description: ''
      };

      expect(factory.calculateHealth(dog)).toBe('healthy');
    });
  });

  describe('registerRule', () => {
    it('should allow registering custom rules', () => {
      const customRule = {
        appliesTo: (pet: Pet) => pet.kind.toLowerCase() === 'bird',
        calculateHealth: () => 'very healthy' as const
      };

      factory.registerRule(customRule);

      const bird: Pet = {
        id: 1,
        name: 'Tweety',
        kind: 'Bird',
        weight: 0.5,
        height: 10,
        length: 15,
        photo_url: '',
        description: ''
      };

      const rule = factory.getRule(bird);
      expect(rule).toBe(customRule);
    });
  });
});
