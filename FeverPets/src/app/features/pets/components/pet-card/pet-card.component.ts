import { Component, input, computed } from '@angular/core';
import { CardComponent } from '@shared/ui';
import { Pet } from '../../models/pet.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PetWeightPipe, PetCentimetersPipe, PetLivesPipe } from '../../pipes';
import { PetHealthBadgeComponent } from '../pet-health-badge';
import { calculateHealth } from '../../utils';

/**
 * Component to display pet card information.
 *
 * @param pet - The pet to display
 * @returns The pet card component
 */
@Component({
  selector: 'fp-pet-card',
  standalone: true,
  imports: [
    CardComponent,
    CommonModule,
    TranslateModule,
    PetWeightPipe,
    PetCentimetersPipe,
    PetLivesPipe,
    PetHealthBadgeComponent
  ],
  template: `
    <fp-card
      class="w-full"
      [contentTemplate]="contentTemplate"
      [footerTemplate]="footerTemplate">

      <ng-template #contentTemplate>
        <div class="flex flex-col gap-4">
          <!-- Pet Image -->
          <img
            [src]="pet().photo_url"
            [alt]="pet().name"
            class="w-full h-48 object-cover rounded" />

          <!-- Pet Info -->
          <div class="flex flex-col gap-2">
            <div class="flex items-start justify-between gap-2">
              <h2 class="text-2xl font-bold">{{ pet().name }}</h2>
              <div class="flex items-center gap-2">
                <fp-pet-health-badge [healthStatus]="healthStatus()" />
                @if (pet().kind.toLowerCase() === 'cat' && pet().number_of_lives) {
                  <span class="text-xs leading-none">{{ pet().number_of_lives! | petLives }}</span>
                }
              </div>
            </div>

            <p class="text-gray-500">
              {{ 'PETS.KIND.' + pet().kind.toUpperCase() | translate }}
            </p>

            <!-- Pet Measurements -->
            <div class="flex flex-wrap gap-4 text-sm text-gray-600">
              <div>
                <span class="font-semibold">{{ 'PETS.WEIGHT' | translate }}: </span>
                <span>{{ pet().weight | petWeight }}</span>
              </div>
              <div>
                <span class="font-semibold">{{ 'PETS.HEIGHT' | translate }}: </span>
                <span>{{ pet().height | petCentimeters }}</span>
              </div>
              <div>
                <span class="font-semibold">{{ 'PETS.LENGTH' | translate }}: </span>
                <span>{{ pet().length | petCentimeters }}</span>
              </div>
            </div>
          </div>
        </div>
      </ng-template>

      <ng-template #footerTemplate>
        <div class="flex gap-2 mt-4">
          <button
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors">
            {{ 'PETS.SEE_MORE' | translate }}
          </button>
        </div>
      </ng-template>
    </fp-card>
  `
})
export class PetCardComponent {
  pet = input.required<Pet>();

  healthStatus = computed(() => calculateHealth(this.pet()));
}
