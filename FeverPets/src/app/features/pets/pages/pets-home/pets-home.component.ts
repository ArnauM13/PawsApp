import { Component, inject, signal, computed, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PetsService } from '../../services/pets.service';
import { Pet } from '../../models/pet.model';

import { DataViewComponent, TopbarComponent } from '@shared/ui';
import { PetCardComponent } from '../../components/pet-card/pet-card.component';
import { PetListItemComponent } from '../../components/pet-list-item';
import { TranslateModule } from '@ngx-translate/core';
import { calculatePage, getRowsPerPage } from '@shared/utils';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'fp-home',
  imports: [
    DataViewComponent,
    PetCardComponent,
    PetListItemComponent,
    TopbarComponent,
    TranslateModule,
    SkeletonModule
  ],
  template: `
  <div class="flex flex-col h-screen p-2">

    <fp-topbar />

    <fp-data-view
      [dataItems]="pets()"
      [totalRecords]="totalRecords()"
      [isLoading]="isLoading()"
      layout="grid"
      [listItemTemplate]="listItemTemplate"
      [gridItemTemplate]="gridItemTemplate"
      [listSkeletonTemplate]="listSkeletonTemplate"
      [gridSkeletonTemplate]="gridSkeletonTemplate"
      (lazyLoad)="onLazyLoad($event)"
      (layoutChange)="onLayoutChange($event)">

      <ng-template #listItemTemplate let-pet>
        <fp-pet-list-item [pet]="pet" />
      </ng-template>
      <ng-template #gridItemTemplate let-pet>
        <fp-pet-card [pet]="pet" />
      </ng-template>

      <ng-template #listSkeletonTemplate>
        <div
          class="flex items-center gap-4 p-4 border-b"
          [style.border-bottom-color]="'var(--p-surface-border, #e5e7eb)'">
          <div class="shrink-0">
            <p-skeleton width="6rem" height="6rem" class="sm:w-8! sm:h-8!" shape="square" />
          </div>

          <div class="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <p-skeleton width="10rem" height="1.5rem" />
                <p-skeleton width="3rem" height="1.25rem" shape="circle" />
                <p-skeleton width="2rem" height="1rem" />
              </div>
              <p-skeleton width="5rem" height="1rem" class="mb-2" />
              <div class="flex flex-wrap gap-3">
                <p-skeleton width="6rem" height="1rem" />
                <p-skeleton width="6rem" height="1rem" />
                <p-skeleton width="6rem" height="1rem" />
              </div>
            </div>
            <div class="shrink-0">
              <p-skeleton width="8rem" height="2.5rem" />
            </div>
          </div>
        </div>
      </ng-template>

      <ng-template #gridSkeletonTemplate>
        <div class="p-6 bg-surface-0 rounded" [style.box-shadow]="'var(--p-card-shadow)'">
          <div class="flex flex-col gap-4">
            <p-skeleton height="12rem" class="w-full rounded" />
            <div class="flex flex-col gap-2">
              <div class="flex items-start justify-between gap-2">
                <p-skeleton width="8rem" height="2rem" />
                <div class="flex items-center gap-2">
                  <p-skeleton width="3rem" height="1.5rem" shape="circle" />
                  <p-skeleton width="2rem" height="1rem" />
                </div>
              </div>
              <p-skeleton width="6rem" height="1.25rem" />
              <div class="flex flex-wrap gap-4">
                <p-skeleton width="5rem" height="1rem" />
                <p-skeleton width="5rem" height="1rem" />
                <p-skeleton width="5rem" height="1rem" />
              </div>
            </div>
          </div>
          <div class="flex gap-2 mt-4">
            <p-skeleton height="2.5rem" class="flex-1 rounded" />
          </div>
        </div>
      </ng-template>
    </fp-data-view>
  </div>
  `,
})
export class PetsHomeComponent implements OnDestroy {
  private readonly petsService = inject(PetsService);
  private readonly destroy$ = new Subject<void>();
  private currentSubscription?: Subscription;

  private readonly currentLayout = signal<'list' | 'grid'>('grid');
  private readonly currentPets = signal<Pet[]>([]);
  private readonly totalPets = signal<number>(0);
  protected readonly isLoading = signal(false);

  protected readonly pets = computed(() => this.currentPets());
  protected readonly totalRecords = computed(() => this.totalPets());

  constructor() {
    this.loadPage(1);
  }

  ngOnDestroy(): void {
    this.currentSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLayoutChange(layout: 'list' | 'grid'): void {
    this.currentLayout.set(layout);
    this.loadPage(1);
  }

  onLazyLoad(event: { first: number; rows: number }): void {
    const page = calculatePage(event.first, event.rows);
    this.loadPage(page);
  }

  private loadPage(page: number): void {
    this.currentSubscription?.unsubscribe();

    this.isLoading.set(true);
    const rows = getRowsPerPage(this.currentLayout());

    this.currentSubscription = this.petsService.getPetsPaginated(page, rows)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.currentPets.set(response.data);
          this.totalPets.set(response.total);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
  }
}
