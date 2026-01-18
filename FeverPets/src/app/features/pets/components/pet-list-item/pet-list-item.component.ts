import { Component, input, computed } from '@angular/core';
import { Pet } from '../../models/pet.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PetInfoComponent } from '../pet-info';
import { calculateHealth } from '../../utils';

/**
 * Component to display pet in list format (normal list item, no card).
 * Maintains the same styling and components as grid view.
 *
 * @param pet - The pet to display
 * @returns The pet list item component
 */
@Component({
  selector: 'fp-pet-list-item',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    PetInfoComponent
  ],
  template: `
    <div
      class="flex items-center gap-4 p-4 border-b hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
      [style.border-bottom-color]="'var(--p-surface-border, #e5e7eb)'">
      <div class="shrink-0">
        <img
          [src]="pet().photo_url"
          [alt]="pet().name"
          class="w-20 h-20 object-cover rounded" />
      </div>

      <div class="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-w-0">
        <div class="flex-1 min-w-0">
          <fp-pet-info [pet]="pet()" layout="list" />
        </div>

        <div class="shrink-0">
          <button
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors cursor-pointer">
            {{ 'PETS.SEE_MORE' | translate }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class PetListItemComponent {
  pet = input.required<Pet>();

  healthStatus = computed(() => calculateHealth(this.pet()));
}
