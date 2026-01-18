import { Component, input } from '@angular/core';
import { CardComponent } from '@shared/ui';
import { Pet } from '../../models/pet.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'fp-pet-card',
  standalone: true,
  imports: [CardComponent, CommonModule, TranslateModule],
  template: `
    <fp-card
      class="w-full"
      [contentTemplate]="contentTemplate"
      [footerTemplate]="footerTemplate">

      <ng-template #contentTemplate>
        <img [src]="pet().photo_url" [alt]="pet().name" class="w-full object-cover" style="height: 200px;" />
        <h2 class="text-2xl font-bold">{{ pet().name }}</h2>
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
}
