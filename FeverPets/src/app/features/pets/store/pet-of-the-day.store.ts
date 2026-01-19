import { computed, inject, Injectable, signal } from '@angular/core';
import { PetsApi } from '@features/pets/api';
import { Pet } from '@features/pets/models';
import { calculatePetIdForToday } from '@features/pets/utils';
import { switchMap } from 'rxjs/operators';

interface PetOfTheDayState {
  pet: Pet | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PetOfTheDayStore {
  private readonly api = inject(PetsApi);

  private readonly state = signal<PetOfTheDayState>({
    pet: null,
    loading: false,
    error: null
  });

  readonly pet = computed(() => this.state().pet);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  load(): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));

    this.api.getPaged({ page: 1, limit: 1 })
      .pipe(
        switchMap((response) => {
          const total = response.total;

          if (total <= 0) {
            throw new Error('No pets available');
          }

          const petId = calculatePetIdForToday(total);
          return this.api.getById(petId);
        })
      )
      .subscribe({
        next: (pet) => {
          this.state.set({
            pet,
            loading: false,
            error: null
          });
        },
        error: (error) => {
          this.state.set({
            pet: null,
            loading: false,
            error: error.message || 'Error loading pet of the day'
          });
        }
      });
  }

  reload(): void {
    this.load();
  }
}
