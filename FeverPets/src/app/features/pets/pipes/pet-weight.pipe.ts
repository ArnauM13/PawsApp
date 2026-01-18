import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to format pet weight from grams to a readable format.
 *
 * Single Responsibility: Only formats weight values
 */
@Pipe({
  name: 'petWeight',
  standalone: true
})
export class PetWeightPipe implements PipeTransform {
  /**
   * Transforms weight in grams to a formatted string with unit
   * @param weight - Weight in grams
   * @returns Formatted string (e.g., "5000 g" or "5 kg" if >= 1000)
   */
  transform(weight: number): string {
    if (weight >= 1000) {
      const kg = weight / 1000;
      return `${kg.toFixed(1)} kg`;
    }
    return `${weight} g`;
  }
}
