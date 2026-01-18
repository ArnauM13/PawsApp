import { Injectable, signal, computed } from '@angular/core';
import { Pet } from '../models/pet.model';

export interface SortState {
  sortField: string | undefined;
  sortOrder: number | undefined;
  sortKey: string | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class PetsSortService {
  private readonly STORAGE_KEY_SORT = 'pets-sort';

  readonly sortField = signal<string | undefined>(undefined);
  readonly sortOrder = signal<number | undefined>(undefined);
  readonly sortKey = signal<string | undefined>(undefined);

  readonly hasSorting = computed(() => {
    return !!this.sortField() && !!this.sortOrder();
  });

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Apply sorting based on sort key value
   * @param sortKey - The sort key (e.g., 'name', '!name', 'weight', etc.)
   */
  applySort(sortKey: string | undefined): void {
    this.sortKey.set(sortKey);
    this.saveToStorage(sortKey);

    if (sortKey && sortKey.indexOf('!') === 0) {
      this.sortOrder.set(-1);
      this.sortField.set(sortKey.substring(1, sortKey.length));
    } else if (sortKey) {
      this.sortOrder.set(1);
      this.sortField.set(sortKey);
    } else {
      this.sortOrder.set(undefined);
      this.sortField.set(undefined);
    }
  }

  /**
   * Sort pets array based on current sort state
   * @param pets - Array of pets to sort
   * @returns Sorted array of pets
   */
  sortPets(pets: Pet[]): Pet[] {
    const sortField = this.sortField();
    const sortOrder = this.sortOrder();

    if (!sortField || !sortOrder) {
      return pets;
    }

    return [...pets].sort((a, b) => {
      let aValue: any = a[sortField as keyof Pet];
      let bValue: any = b[sortField as keyof Pet];

      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortOrder === 1 ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 1 ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * Get current sort state
   * @returns Current sort state
   */
  getSortState(): SortState {
    return {
      sortField: this.sortField(),
      sortOrder: this.sortOrder(),
      sortKey: this.sortKey()
    };
  }

  /**
   * Clear sorting
   */
  clearSort(): void {
    this.applySort(undefined);
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedSortKey = localStorage.getItem(this.STORAGE_KEY_SORT);
      if (savedSortKey) {
        this.applySort(savedSortKey);
      }
    }
  }

  private saveToStorage(sortKey: string | undefined): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (sortKey) {
        localStorage.setItem(this.STORAGE_KEY_SORT, sortKey);
      } else {
        localStorage.removeItem(this.STORAGE_KEY_SORT);
      }
    }
  }
}
