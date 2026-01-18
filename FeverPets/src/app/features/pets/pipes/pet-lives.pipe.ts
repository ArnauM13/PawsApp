import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to display pet lives as heart emojis.
 * 
 * Single Responsibility: Only formats number of lives as hearts
 */
@Pipe({
  name: 'petLives',
  standalone: true
})
export class PetLivesPipe implements PipeTransform {
  /**
   * Transforms number of lives (1-7) to heart emojis
   * @param lives - Number of lives (1-7)
   * @returns String with heart emojis (e.g., "❤️❤️❤️")
   */
  transform(lives: number): string {
    if (!lives || lives < 1 || lives > 7) {
      return '';
    }
    return '❤️'.repeat(lives);
  }
}
