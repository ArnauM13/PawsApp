import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to format weight in grams to a readable format.
 *
 * @param weight - Weight in grams
 * @returns Formatted string (e.g., "5.0 kg" or "5000 g"). Returns empty string if value is invalid (not a number).
 */
@Pipe({
  name: 'petWeight'
})
export class PetWeightPipe implements PipeTransform {
  transform(weight: number): string {
    if (weight >= 1000) {
      const kg = weight / 1000;
      return `${kg.toFixed(1)} kg`;
    }
    return `${weight} g`;
  }
}
