import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to format values in centimeters.
 * 
 * Single Responsibility: Only formats centimeter values
 */
@Pipe({
  name: 'petCentimeters',
  standalone: true
})
export class PetCentimetersPipe implements PipeTransform {
  /**
   * Transforms a value in centimeters to a formatted string with unit
   * @param value - Value in centimeters
   * @returns Formatted string (e.g., "50 cm")
   */
  transform(value: number): string {
    return `${value} cm`;
  }
}
