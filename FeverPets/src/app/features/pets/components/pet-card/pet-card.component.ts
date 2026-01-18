import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { APP_CONFIG } from '@core/config';
import { PetInfoComponent } from '@features/pets/components';
import { Pet } from '@features/pets/models';
import { calculateHealth } from '@features/pets/utils';
import { ImageFallbackDirective } from '@shared/directives';
import { CardComponent } from '@shared/ui';

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
    PetInfoComponent,
    ImageFallbackDirective
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
            [fpImageFallback]="logoPath"
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
  protected readonly logoPath = APP_CONFIG.logoPath;

  healthStatus = computed(() => calculateHealth(this.pet()));
}
