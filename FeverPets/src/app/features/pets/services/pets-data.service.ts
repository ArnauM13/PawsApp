import { computed, inject, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Pet } from '@features/pets/models';
import { PaginatedResponse, PetsService } from './pets.service';
import { PetsSortService } from './pets-sort.service';

@Injectable({
  providedIn: 'root'
})
export class PetsDataService {
  private readonly petsService = inject(PetsService);
  private readonly sortService = inject(PetsSortService);
  private readonly destroy$ = new Subject<void>();

  private readonly currentPets = signal<Pet[]>([]);
  private readonly allPets = signal<Pet[]>([]);
  private readonly totalPets = signal<number>(0);
  private readonly isLoading = signal(false);
  private readonly isLoadingAllPets = signal(false);

  readonly pets = computed(() => {
    const hasSorting = this.sortService.hasSorting();
    const allPets = this.allPets();

    if (hasSorting && allPets.length > 0) {
      return this.sortService.sortPets(allPets);
    }
    return this.currentPets();
  });

  readonly totalRecords = computed(() => {
    const hasSorting = this.sortService.hasSorting();
    const allPets = this.allPets();

    return (hasSorting && allPets.length > 0) ? allPets.length : this.totalPets();
  });

  readonly isLoadingSignal = computed(() => this.isLoading());
  readonly isLoadingAllPetsSignal = computed(() => this.isLoadingAllPets());

  /**
   * Load paginated pets
   * @param page - Page number (starts at 1)
   * @param limit - Number of items per page
   */
  loadPage(page: number, limit: number): void {
    this.isLoading.set(true);

    this.petsService.getPetsPaginated(page, limit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginatedResponse<Pet>) => {
          this.currentPets.set(response.data);
          this.totalPets.set(response.total);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
  }

  /**
   * Load all pets in background (for sorting)
   */
  loadAllPetsInBackground(): void {
    if (this.isLoadingAllPets() || this.allPets().length > 0) {
      return;
    }

    this.isLoadingAllPets.set(true);

    this.petsService.getPets()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pets) => {
          this.allPets.set(pets);
          this.isLoadingAllPets.set(false);
        },
        error: () => {
          this.isLoadingAllPets.set(false);
        }
      });
  }

  /**
   * Clear all pets data (used when sorting is cleared)
   */
  clearAllPets(): void {
    this.allPets.set([]);
  }

  /**
   * Check if we should load page or use pagination from DataView
   * @returns true if should load page from API, false if pagination is handled by DataView
   */
  shouldLoadPage(): boolean {
    const hasSorting = this.sortService.hasSorting();
    return !hasSorting || this.allPets().length === 0;
  }

  /**
   * Cleanup method to be called when component is destroyed
   */
  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
