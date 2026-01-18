import { Component, input, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent } from '@shared/ui';
import { Pet } from '../../models/pet.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PetInfoComponent } from '../pet-info';
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
    RouterModule,
    TranslateModule,
    PetInfoComponent
  ],
  template: `
    <fp-card
      class="w-full"
      [contentTemplate]="contentTemplate"
      [footerTemplate]="footerTemplate">

      <ng-template #contentTemplate>
        <div class="flex flex-col gap-4">
          <img
            [src]="pet().photo_url"
            [alt]="pet().name"
            class="w-full h-48 object-cover rounded" />

          <fp-pet-info [pet]="pet()" layout="grid" />
        </div>
      </ng-template>

      <ng-template #footerTemplate>
        <div class="flex gap-2 mt-4">
          <a
            [routerLink]="['/pet', pet().id]"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors cursor-pointer text-center">
            {{ 'PETS.SEE_MORE' | translate }}
          </a>
        </div>
      </ng-template>
    </fp-card>
  `
})
export class PetCardComponent {
  pet = input.required<Pet>();

  healthStatus = computed(() => calculateHealth(this.pet()));
}
