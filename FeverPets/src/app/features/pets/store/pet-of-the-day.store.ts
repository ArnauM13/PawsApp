import { computed, inject, Injectable, signal } from '@angular/core';
import { PetsApi } from '@features/pets/api';
import { Pet } from '@features/pets/models';
import { calculatePetIdForToday, getDaySeed } from '@features/pets/utils';
import { switchMap } from 'rxjs/operators';

interface PetOfTheDayState {
  pet: Pet | null;
  loading: boolean;
  error: string | null;
  dayHash: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class PetOfTheDayStore {
  private readonly api = inject(PetsApi);

  private readonly state = signal<PetOfTheDayState>({
    pet: null,
    loading: false,
    error: null,
    dayHash: null
  });

  readonly pet = computed(() => this.state().pet);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  load(): void {
    const currentDayHash = getDaySeed();
    const state = this.state();

    if (state.dayHash === currentDayHash && state.pet !== null) {
      return;
    }

    this.state.update(s => ({ ...s, loading: true, error: null }));

    this.api.getTotal()
      .pipe(
        switchMap((total) => {
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
            error: null,
            dayHash: currentDayHash
          });
        },
        error: (error) => {
          this.state.set({
            pet: null,
            loading: false,
            error: error.message || 'Error loading pet of the day',
            dayHash: null
          });
        }
      });
  }

  reload(): void {
    this.state.update(s => ({ ...s, dayHash: null }));
    this.load();
  }
}
