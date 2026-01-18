import { Component, inject, signal, computed, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PetsService } from '../../services/pets.service';
import { Pet } from '../../models/pet.model';

import { DataViewComponent, TopbarComponent } from '@shared/ui';
import { PetCardComponent } from '../../components/pet-card/pet-card.component';
import { PetListItemComponent } from '../../components/pet-list-item';
import { PetOfTheDayComponent } from '../../components/pet-of-the-day';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { calculatePage, getRowsPerPage } from '@shared/utils';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'fp-home',
  imports: [
    DataViewComponent,
    PetCardComponent,
    PetListItemComponent,
    PetOfTheDayComponent,
    TopbarComponent,
    TranslateModule,
    SkeletonModule,
    SelectModule,
    FormsModule
  ],
  template: `
  <div class="flex flex-col h-screen p-2">

    <fp-topbar />

    <fp-pet-of-the-day />

    <fp-data-view
      [dataItems]="pets()"
      [totalRecords]="totalRecords()"
      [isLoading]="isLoading()"
      layout="grid"
      [sortField]="undefined"
      [sortOrder]="undefined"
      [lazy]="!sortField()"
      [headerTemplate]="headerTemplate"
      [listItemTemplate]="listItemTemplate"
      [gridItemTemplate]="gridItemTemplate"
      [listSkeletonTemplate]="listSkeletonTemplate"
      [gridSkeletonTemplate]="gridSkeletonTemplate"
      (lazyLoad)="onLazyLoad($event)"
      (layoutChange)="onLayoutChange($event)">

      <ng-template #headerTemplate>
        <p-select
          [options]="sortOptions"
          [(ngModel)]="sortKey"
          optionLabel="label"
          optionValue="value"
          [placeholder]="'PETS.SORT.BY' | translate"
          (onChange)="onSortChange($event)"
          class="w-full md:w-auto" />
      </ng-template>

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
            <p-skeleton width="6rem" height="6rem" shape="square" />
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
                  <p-skeleton width="1.5rem" height="1.5rem" shape="circle" />
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
export class PetsHomeComponent implements OnInit, OnDestroy {
  private readonly petsService = inject(PetsService);
  private readonly translate = inject(TranslateService);
  private readonly destroy$ = new Subject<void>();
  private currentSubscription?: Subscription;

  private readonly currentLayout = signal<'list' | 'grid'>('grid');
  private readonly currentPets = signal<Pet[]>([]);
  private readonly allPets = signal<Pet[]>([]);
  private readonly totalPets = signal<number>(0);
  protected readonly isLoading = signal(false);
  private readonly isLoadingAllPets = signal(false);
  private allPetsSubscription?: Subscription;

  protected readonly sortField = signal<string | undefined>(undefined);
  protected readonly sortOrder = signal<number | undefined>(undefined);
  protected sortKey: string | undefined;
  protected sortOptions: SelectItem[] = [];

  protected readonly pets = computed(() => {
    const sortField = this.sortField();
    const sortOrder = this.sortOrder();

    if (sortField && sortOrder) {
      const allPets = this.allPets();
      if (allPets.length > 0) {
        return this.sortPets([...allPets], sortField, sortOrder);
      }
      return this.currentPets();
    }
    return this.currentPets();
  });

  protected readonly totalRecords = computed(() => {
    const sortField = this.sortField();
    const allPets = this.allPets();

    return (sortField && allPets.length > 0) ? allPets.length : this.totalPets();
  });

  constructor() {
    this.loadPage(1);
  }

  ngOnInit(): void {
    this.initializeSortOptions();
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.initializeSortOptions();
      });
  }

  private initializeSortOptions(): void {
    this.sortOptions = [
      { label: this.translate.instant('PETS.SORT.NAME_ASC'), value: 'name' },
      { label: this.translate.instant('PETS.SORT.NAME_DESC'), value: '!name' },
      { label: this.translate.instant('PETS.SORT.WEIGHT_ASC'), value: 'weight' },
      { label: this.translate.instant('PETS.SORT.WEIGHT_DESC'), value: '!weight' },
      { label: this.translate.instant('PETS.SORT.HEIGHT_ASC'), value: 'height' },
      { label: this.translate.instant('PETS.SORT.HEIGHT_DESC'), value: '!height' },
      { label: this.translate.instant('PETS.SORT.LENGTH_ASC'), value: 'length' },
      { label: this.translate.instant('PETS.SORT.LENGTH_DESC'), value: '!length' },
      { label: this.translate.instant('PETS.SORT.KIND_ASC'), value: 'kind' },
      { label: this.translate.instant('PETS.SORT.KIND_DESC'), value: '!kind' }
    ];
  }

  onSortChange(event: any): void {
    const value = event.value;

    if (value && value.indexOf('!') === 0) {
      this.sortOrder.set(-1);
      this.sortField.set(value.substring(1, value.length));
    } else if (value) {
      this.sortOrder.set(1);
      this.sortField.set(value);
    } else {
      this.sortOrder.set(undefined);
      this.sortField.set(undefined);
    }

    if (value) {
      this.loadAllPetsInBackground();
    } else {
      this.allPets.set([]);
      this.loadPage(1);
    }
  }

  private loadAllPetsInBackground(): void {
    if (this.isLoadingAllPets() || this.allPets().length > 0) {
      return;
    }

    this.isLoadingAllPets.set(true);
    this.allPetsSubscription?.unsubscribe();

    this.allPetsSubscription = this.petsService.getPets()
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

  private sortPets(pets: Pet[], sortField: string, sortOrder: number): Pet[] {
    return pets.sort((a, b) => {
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

  ngOnDestroy(): void {
    this.currentSubscription?.unsubscribe();
    this.allPetsSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLayoutChange(layout: 'list' | 'grid'): void {
    this.currentLayout.set(layout);
    this.loadPage(1);
  }

  onLazyLoad(event: { first: number; rows: number }): void {
    const page = calculatePage(event.first, event.rows);
    const sortField = this.sortField();

    if (!sortField || this.allPets().length === 0) {
      this.loadPage(page);
    }
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
