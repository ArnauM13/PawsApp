import { Injectable, signal } from '@angular/core';

export type PetsLayout = 'list' | 'grid';

@Injectable({
  providedIn: 'root'
})
export class PetsLayoutService {
  private readonly STORAGE_KEY_LAYOUT = 'pets-layout';

  readonly layout = signal<PetsLayout>('grid');

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Set layout and save to storage
   * @param layout - The layout to set ('list' or 'grid')
   */
  setLayout(layout: PetsLayout): void {
    this.layout.set(layout);
    this.saveToStorage(layout);
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedLayout = localStorage.getItem(this.STORAGE_KEY_LAYOUT) as PetsLayout | null;
      if (savedLayout && (savedLayout === 'list' || savedLayout === 'grid')) {
        this.layout.set(savedLayout);
      }
    }
  }

  private saveToStorage(layout: PetsLayout): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY_LAYOUT, layout);
    }
  }
}
