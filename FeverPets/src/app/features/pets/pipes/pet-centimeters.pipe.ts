import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to format values in centimeters.
 *
 * @param value - Value in centimeters
 * @returns Formatted string (e.g., "50 cm")
 */
@Pipe({
  name: 'petCentimeters'
})
export class PetCentimetersPipe implements PipeTransform {
  transform(value: number): string {
    return `${value} cm`;
  }
}
