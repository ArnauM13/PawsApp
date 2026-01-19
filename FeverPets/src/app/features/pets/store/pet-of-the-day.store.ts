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

/**
 * Store for managing the "Pet of the Day" feature state.
 *
 * This store handles the deterministic selection of a pet for each calendar day.
 * The same pet is selected for the entire day, ensuring consistency across
 * user sessions. Uses a day-based hash to determine the pet ID.
 */
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

  /** Observable signal of the current pet of the day */
  readonly pet = computed(() => this.state().pet);

  /** Observable signal indicating if the pet is currently being loaded */
  readonly loading = computed(() => this.state().loading);

  /** Observable signal of any error that occurred during loading */
  readonly error = computed(() => this.state().error);

  /**
   * Loads the pet of the day.
   *
   * This method:
   * - Checks if a pet is already loaded for today (using day hash)
   * - If not, fetches the total number of pets
   * - Calculates a deterministic pet ID based on today's date
   * - Fetches and stores the selected pet
   *
   * The same pet will be selected for the entire day, regardless of when
   * this method is called.
   *
   * @example
   * ```typescript
   * store.load();
   * // Later in the same day
   * store.load(); // Returns cached pet, no new API call
   * ```
   */
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

  /**
   * Forces a reload of the pet of the day.
   *
   * Clears the day hash cache and triggers a fresh load.
   * Useful for testing or when you need to refresh the pet selection.
   *
   * @example
   * ```typescript
   * store.reload(); // Forces new pet selection
   * ```
   */
  reload(): void {
    this.state.update(s => ({ ...s, dayHash: null }));
    this.load();
  }
}
