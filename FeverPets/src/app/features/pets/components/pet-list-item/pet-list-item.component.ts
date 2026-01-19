import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { APP_CONFIG } from '@core/config';
import { PetInfoComponent } from '@features/pets/components';
import { Pet } from '@features/pets/models';
import { calculateHealth } from '@features/pets/utils';
import { ImageFallbackDirective } from '@shared/directives';

/**
 * Component to display pet in list format (normal list item, no card).
 * Maintains the same styling and components as grid view.
 *
 * @param pet - The pet to display
 * @returns The pet list item component
 */
@Component({
  selector: 'fp-pet-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    PetInfoComponent,
    ImageFallbackDirective
  ],
  template: `
    <div
      class="flex items-center gap-4 p-4 border-b hover:bg-surface-50 transition-colors"
      [style.border-bottom-color]="'var(--p-surface-border, #e5e7eb)'">
      <div class="shrink-0">
        <img
          [src]="pet().photo_url"
          [alt]="pet().name"
          [fpImageFallback]="logoPath"
          class="w-20 h-20 object-cover rounded" />
      </div>

      <div class="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-w-0">
        <div class="flex-1 min-w-0">
          <fp-pet-info [pet]="pet()" layout="list" />
        </div>

        <div class="shrink-0">
          <a
            [routerLink]="['/pet', pet().id]"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors cursor-pointer inline-block">
            {{ 'PETS.SEE_MORE' | translate }}
          </a>
        </div>
      </div>
    </div>
  `
})
export class PetListItemComponent {
  pet = input.required<Pet>();
  protected readonly logoPath = APP_CONFIG.logoPath;

  healthStatus = computed(() => calculateHealth(this.pet()));
}
