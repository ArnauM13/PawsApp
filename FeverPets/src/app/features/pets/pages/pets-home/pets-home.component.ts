import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PetsService } from '../../services/pets.service';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'fp-pets-home',
  standalone: true,
  template: `
    <div class="pets-home">
      <h1>FeverPets Dashboard</h1>
    </div>
  `,
  styles: [`
    .pets-home {
      padding: 2rem;
    }
  `]
})
export class PetsHomeComponent {
  private readonly petsService = inject(PetsService);

  protected readonly pets = toSignal(this.petsService.getPets(), {
    initialValue: [] as Pet[]
  });

  constructor() {
    effect(() => {
      const petsData = this.pets();
      if (petsData && petsData.length > 0) {
        console.log('Pets loaded:', petsData);
      }
    });
  }
}
