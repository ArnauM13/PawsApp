import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PetKindPipe } from './pet-kind.pipe';
import { TranslateService } from '@ngx-translate/core';

describe('PetKindPipe', () => {
  let pipe: PetKindPipe;
  let translateService: TranslateService;

  beforeEach(() => {
    translateService = {
      instant: vi.fn()
    } as unknown as TranslateService;
    
    pipe = new PetKindPipe();
    // Inject the translate service manually for testing
    (pipe as any).translate = translateService;
  });

  it('should return translated value when translation exists', () => {
    vi.mocked(translateService.instant).mockReturnValue('Dog');
    
    const result = pipe.transform('dog');
    
    expect(translateService.instant).toHaveBeenCalledWith('PETS.KIND.DOG');
    expect(result).toBe('Dog');
  });

  it('should return capitalized kind when translation does not exist', () => {
    // When translation doesn't exist, instant returns the key itself
    vi.mocked(translateService.instant).mockReturnValue('PETS.KIND.BIRD');
    
    const result = pipe.transform('bird');
    
    expect(translateService.instant).toHaveBeenCalledWith('PETS.KIND.BIRD');
    expect(result).toBe('Bird');
  });

  it('should handle lowercase input', () => {
    vi.mocked(translateService.instant).mockReturnValue('PETS.KIND.RABBIT');
    
    const result = pipe.transform('rabbit');
    
    expect(result).toBe('Rabbit');
  });

  it('should handle uppercase input', () => {
    vi.mocked(translateService.instant).mockReturnValue('PETS.KIND.FISH');
    
    const result = pipe.transform('FISH');
    
    expect(result).toBe('Fish');
  });

  it('should handle mixed case input', () => {
    vi.mocked(translateService.instant).mockReturnValue('PETS.KIND.HAMSTER');
    
    const result = pipe.transform('HaMsTeR');
    
    expect(result).toBe('Hamster');
  });

  it('should return empty string for empty input', () => {
    const result = pipe.transform('');
    
    expect(result).toBe('');
  });

  it('should handle existing translations correctly', () => {
    vi.mocked(translateService.instant).mockReturnValue('Cat');
    
    const result = pipe.transform('cat');
    
    expect(result).toBe('Cat');
    expect(translateService.instant).toHaveBeenCalledWith('PETS.KIND.CAT');
  });
});
