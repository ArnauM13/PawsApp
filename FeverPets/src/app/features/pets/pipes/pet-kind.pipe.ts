import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'petKind',
  standalone: true
})
export class PetKindPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

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
