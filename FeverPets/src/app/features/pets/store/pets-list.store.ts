import { computed, inject, Injectable, signal } from '@angular/core';
import { PetsApi, PetsQuery } from '@features/pets/api';
import { Pet } from '@features/pets/models';

interface PetsListState {
  pets: Pet[];
  total: number;
  loading: boolean;
  error: string | null;
}

/**
 * Store for managing the pets list state.
 * 
 * This store uses Angular signals to manage reactive state for the pets list,
 * including pagination, sorting, filtering, loading states, and errors.
 * It provides a clean separation between state management and UI components.
 */
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

  /** Observable signal of the current list of pets */
  readonly pets = computed(() => this.state().pets);
  
  /** Observable signal of the total number of pets */
  readonly total = computed(() => this.state().total);
  
  /** Observable signal indicating if pets are currently being loaded */
  readonly loading = computed(() => this.state().loading);
  
  /** Observable signal of any error that occurred during loading */
  readonly error = computed(() => this.state().error);

  /**
   * Updates the query parameters and triggers a new data load if needed.
   * 
   * This method merges the provided updates with the current query and
   * automatically loads new data unless the query hasn't changed and
   * forceLoad is false.
   * 
   * @param updates - Partial query parameters to update
   * @param forceLoad - If true, forces a reload even if query hasn't changed
   * 
   * @example
   * ```typescript
   * // Update page
   * store.updateQuery({ page: 2 });
   * 
   * // Update sorting
   * store.updateQuery({ sortField: 'name', sortOrder: 'asc' });
   * 
   * // Force reload with same query
   * store.updateQuery({}, true);
   * ```
   */
  updateQuery(updates: Partial<PetsQuery>, forceLoad: boolean = false): void {
    const currentQuery = this.query();
    const newQuery: PetsQuery = {
      ...currentQuery,
      ...updates
    };

    if (!forceLoad && this.isQueryEqual(currentQuery, newQuery)) {
      return;
    }

    this.query.set(newQuery);
    this.loadPets(newQuery);
  }

  private isQueryEqual(query1: PetsQuery, query2: PetsQuery): boolean {
    return (
      query1.page === query2.page &&
      query1.limit === query2.limit &&
      query1.sortField === query2.sortField &&
      query1.sortOrder === query2.sortOrder &&
      JSON.stringify(query1.filters) === JSON.stringify(query2.filters)
    );
  }

  /**
   * Sets the sorting parameters and resets to page 1.
   * 
   * @param sortField - The field to sort by (e.g., 'name', 'weight', 'height')
   * @param sortOrder - The sort direction: 'asc' or 'desc'
   * 
   * @example
   * ```typescript
   * store.setSorting('name', 'asc');
   * ```
   */
  setSorting(sortField: string | undefined, sortOrder: 'asc' | 'desc' | undefined): void {
    this.updateQuery({
      sortField,
      sortOrder,
      page: 1
    });
  }

  /**
   * Clears all sorting parameters and resets to page 1.
   * 
   * @example
   * ```typescript
   * store.clearSorting();
   * ```
   */
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

  /**
   * Gets the current query parameters.
   * 
   * @returns The current query object with all parameters
   * 
   * @example
   * ```typescript
   * const query = store.getCurrentQuery();
   * console.log(query.page, query.sortField);
   * ```
   */
  getCurrentQuery(): PetsQuery {
    return this.query();
  }

  /**
   * Resets the store to its initial state.
   * 
   * Clears all pets, resets pagination to page 1, and clears any errors.
   * Useful for cleanup or when starting a fresh search.
   * 
   * @example
   * ```typescript
   * store.reset();
   * ```
   */
  reset(): void {
    this.state.set({
      pets: [],
      total: 0,
      loading: false,
      error: null
    });
    this.query.set({
      page: 1,
      limit: 6
    });
  }
}
