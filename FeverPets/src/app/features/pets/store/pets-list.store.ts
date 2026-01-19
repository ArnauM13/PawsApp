import { computed, inject, Injectable, signal } from '@angular/core';
import { PetsApi, PetsQuery } from '@features/pets/api';
import { Pet } from '@features/pets/models';

interface PetsListState {
  pets: Pet[];
  total: number;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PetsListStore {
  private readonly api = inject(PetsApi);

  private readonly state = signal<PetsListState>({
    pets: [],
    total: 0,
    loading: false,
    error: null
  });

  private readonly query = signal<PetsQuery>({
    page: 1,
    limit: 6
  });

  readonly pets = computed(() => this.state().pets);
  readonly total = computed(() => this.state().total);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  updateQuery(updates: Partial<PetsQuery>): void {
    const currentQuery = this.query();
    const newQuery: PetsQuery = {
      ...currentQuery,
      ...updates
    };

    this.query.set(newQuery);
    this.loadPets(newQuery);
  }

  setSorting(sortField: string | undefined, sortOrder: 'asc' | 'desc' | undefined): void {
    this.updateQuery({
      sortField,
      sortOrder,
      page: 1
    });
  }

  clearSorting(): void {
    this.updateQuery({
      sortField: undefined,
      sortOrder: undefined,
      page: 1
    });
  }

  private loadPets(query: PetsQuery): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));

    this.api.getPaged(query).subscribe({
      next: (response) => {
        this.state.set({
          pets: response.data,
          total: response.total,
          loading: false,
          error: null
        });
      },
      error: (error) => {
        this.state.set({
          pets: [],
          total: 0,
          loading: false,
          error: error.message || 'Error loading pets'
        });
      }
    });
  }

  getCurrentQuery(): PetsQuery {
    return this.query();
  }
}
