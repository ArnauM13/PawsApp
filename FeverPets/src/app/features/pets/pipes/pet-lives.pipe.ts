import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to display pet lives as heart emojis.
 *
 * @param value - Value in centimeters
 * @returns Heart emojis (e.g., "❤️❤️❤️"). Returns empty string if value is invalid (not between 1 and 7).
 */
@Pipe({
  name: 'petLives'
})
export class PetLivesPipe implements PipeTransform {
  transform(lives: number): string {
    if (!lives || lives < 1 || lives > 7) {
      return '';
    }
    return '❤️'.repeat(lives);
  }
}
