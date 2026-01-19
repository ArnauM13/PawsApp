import { computed, inject, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Pet } from '@features/pets/models';
import { PaginatedResponse, PetsService } from './pets.service';

@Injectable({
  providedIn: 'root'
})
export class PetsDataService {
  private readonly petsService = inject(PetsService);
  private readonly destroy$ = new Subject<void>();

  private readonly currentPets = signal<Pet[]>([]);
  private readonly totalPets = signal<number>(0);
  private readonly isLoading = signal(false);

  readonly pets = computed(() => this.currentPets());
  readonly totalRecords = computed(() => this.totalPets());
  readonly isLoadingSignal = computed(() => this.isLoading());

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

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
