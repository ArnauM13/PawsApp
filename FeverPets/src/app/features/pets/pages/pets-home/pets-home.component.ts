import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { PetsService } from '../../services/pets.service';
import { Pet } from '../../models/pet.model';

import { DataViewComponent } from '../../../../shared/ui/dataview/dataview.component';
import { PetCardComponent } from '../../components/pet-card/pet-card.component';
import { TopbarComponent } from '../../../../shared/ui/topbar/topbar.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'fp-home',
  imports: [DataViewComponent, PetCardComponent, TopbarComponent, TranslateModule],
  template: `
    <fp-topbar></fp-topbar>
    <div class="p-4">
      <fp-data-view
        [dataItems]="pets()"
        layout="grid"
        [itemTemplate]="itemTemplate">

        <ng-template #itemTemplate let-pet>
          <fp-pet-card [pet]="pet"></fp-pet-card>
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
