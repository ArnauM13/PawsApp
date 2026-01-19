import { describe, it, expect } from 'vitest';
import { calculatePage, calculateFirst, getRowsPerPage, PAGINATION_CONFIG } from './pagination.constants';

describe('pagination.constants', () => {
  describe('calculatePage', () => {
    it('should calculate page 1 for first element', () => {
      expect(calculatePage(0, 10)).toBe(1);
    });

    it('should calculate correct page for middle elements', () => {
      expect(calculatePage(10, 10)).toBe(2);
      expect(calculatePage(20, 10)).toBe(3);
      expect(calculatePage(30, 10)).toBe(4);
    });

    it('should handle different row sizes', () => {
      expect(calculatePage(6, 6)).toBe(2);
      expect(calculatePage(12, 6)).toBe(3);
    });
  });

  describe('calculateFirst', () => {
    it('should calculate first index for page 1', () => {
      expect(calculateFirst(1, 10)).toBe(0);
    });

    it('should calculate correct first index for other pages', () => {
      expect(calculateFirst(2, 10)).toBe(10);
      expect(calculateFirst(3, 10)).toBe(20);
      expect(calculateFirst(4, 10)).toBe(30);
    });

    it('should handle different row sizes', () => {
      expect(calculateFirst(2, 6)).toBe(6);
      expect(calculateFirst(3, 6)).toBe(12);
    });
  });

  describe('getRowsPerPage', () => {
    it('should return 10 rows for list layout', () => {
      expect(getRowsPerPage('list')).toBe(10);
    });

    it('should return 6 rows for grid layout', () => {
      expect(getRowsPerPage('grid')).toBe(6);
    });
  });

  describe('PAGINATION_CONFIG', () => {
    it('should have correct configuration values', () => {
      expect(PAGINATION_CONFIG.list).toBe(10);
      expect(PAGINATION_CONFIG.grid).toBe(6);
    });
  });
});
