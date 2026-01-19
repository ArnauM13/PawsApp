import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Pipe to transform pet kind strings with internationalization support.
 *
 * This pipe:
 * - Attempts to translate the pet kind using the i18n system
 * - Falls back to capitalizing the kind string if no translation exists
 * - Ensures new pet types are displayed correctly even without translations
 *
 * @example
 * ```html
 * {{ pet.kind | petKind }}
 * <!-- If 'dog' has translation: shows translated text -->
 * <!-- If 'bird' has no translation: shows 'Bird' (capitalized) -->
 * ```
 */
@Pipe({
  name: 'petKind'
})
export class PetKindPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  /**
   * Transforms a pet kind string to its translated or capitalized form.
   *
   * @param kind - The pet kind string to transform (e.g., 'dog', 'cat', 'bird')
   * @returns The translated kind if available, otherwise the capitalized kind
   *
   * @example
   * ```typescript
   * pipe.transform('dog'); // Returns translated 'Dog' or 'Perro' (if translation exists)
   * pipe.transform('bird'); // Returns 'Bird' (capitalized, no translation)
   * ```
   */
  transform(kind: string): string {
    if (!kind) return '';

    const translationKey = `PETS.KIND.${kind.toUpperCase()}`;
    const translated = this.translate.instant(translationKey);

    if (translated === translationKey) {
      return this.capitalizeFirst(kind);
    }

    return translated;
  }

  private capitalizeFirst(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
