import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PetHealthBadgeComponent } from '@features/pets/components';
import { Pet } from '@features/pets/models';
import { PetCentimetersPipe, PetKindPipe, PetLivesPipe, PetWeightPipe } from '@features/pets/pipes';
import { calculateHealth } from '@features/pets/utils';

/**
 * Component to display pet information (reusable for both grid and list views).
 *
 * @param pet - The pet to display
 * @param layout - Layout mode: 'grid' or 'list'
 * @returns The pet info component
 */
@Component({
  selector: 'pa-pet-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslateModule,
    PetWeightPipe,
    PetCentimetersPipe,
    PetKindPipe,
    PetLivesPipe,
    PetHealthBadgeComponent
  ],
  template: `
    <div [class]="layout() === 'grid' ? 'flex flex-col gap-2' : ''">
      <div [class]="layout() === 'grid' ? 'flex items-start justify-between gap-2' : 'flex items-center gap-2 mb-2'">
        <h2 [class]="layout() === 'grid' ? 'text-2xl font-bold' : 'text-2xl font-bold truncate'">{{ pet().name }}</h2>
        <div class="flex items-center gap-2">
          <pa-pet-health-badge [healthStatus]="healthStatus()" />
          @if (pet().number_of_lives) {
            <span class="text-xs leading-none">{{ pet().number_of_lives! | petLives }}</span>
          }
        </div>
      </div>

      <p [class]="layout() === 'grid' ? 'text-gray-500' : 'text-gray-500 mb-1'">
        {{ pet().kind | petKind }}
      </p>

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
  `
})
export class PetInfoComponent {
  pet = input.required<Pet>();
  layout = input<'grid' | 'list'>('grid');

  healthStatus = computed(() => calculateHealth(this.pet()));
}
