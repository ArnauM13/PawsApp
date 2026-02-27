import { Injectable, signal } from '@angular/core';

export type PetsLayout = 'list' | 'grid';

@Injectable({
  providedIn: 'root'
})
export class PetsLayoutService {
  readonly layout = signal<PetsLayout>('grid');

  setLayout(layout: PetsLayout): void {
    this.layout.set(layout);
  }
}
