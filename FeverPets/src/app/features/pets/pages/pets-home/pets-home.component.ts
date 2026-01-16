import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PetsService } from '../../services/pets.service';
import { Pet } from '../../models/pet.model';
import { DataViewComponent } from '../../../../shared/ui/dataview/dataview.component';

@Component({
  selector: 'fp-pets-home',
  imports: [DataViewComponent],
  template: `
    <div class="container mx-auto">
      <fp-data-view
        [dataItems]="pets()"
        layout="grid"
        [headerTemplate]="headerTemplate"
        [itemTemplate]="itemTemplate">

        <ng-template #headerTemplate>
          <h1>Pets</h1>
        </ng-template>

        <ng-template #itemTemplate let-pet>
            <div class="flex flex-col items-center justify-center">
              <img [src]="pet.photo_url" [alt]="pet.name" class="w-24 h-24 rounded-full" />
              <p>{{ pet.name }}</p>
            </div>
        </ng-template>

      </fp-data-view>
    </div>
  `,
})
export class PetsHomeComponent {
  private readonly petsService = inject(PetsService);

  protected readonly pets = toSignal(this.petsService.getPets(), {
    initialValue: [] as Pet[]
  });
}
