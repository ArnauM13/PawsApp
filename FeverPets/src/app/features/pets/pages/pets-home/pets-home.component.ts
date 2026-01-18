import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PetsDataService, PetsSortService } from '../../services';
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
      [dataItems]="dataService.pets()"
      [totalRecords]="dataService.totalRecords()"
      [isLoading]="dataService.isLoadingSignal()"
      layout="grid"
      [sortField]="undefined"
      [sortOrder]="undefined"
      [lazy]="!sortService.hasSorting()"
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
  protected readonly dataService = inject(PetsDataService);
  protected readonly sortService = inject(PetsSortService);
  private readonly translate = inject(TranslateService);
  private readonly destroy$ = new Subject<void>();

  private readonly currentLayout = signal<'list' | 'grid'>('grid');
  protected sortOptions: SelectItem[] = [];

  protected get sortKey(): string | undefined {
    return this.sortService.sortKey();
  }

  protected set sortKey(value: string | undefined) {
    this.sortService.sortKey.set(value);
  }

  constructor() {
    const rows = getRowsPerPage(this.currentLayout());
    this.dataService.loadPage(1, rows);
  }

  ngOnInit(): void {
    this.initializeSortOptions();
    this.handleSortChange();
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
    this.sortService.applySort(value);
    this.handleSortChange();
  }

  private handleSortChange(): void {
    if (this.sortService.hasSorting()) {
      this.dataService.loadAllPetsInBackground();
    } else {
      this.dataService.clearAllPets();
      const rows = getRowsPerPage(this.currentLayout());
      this.dataService.loadPage(1, rows);
    }
  }

  ngOnDestroy(): void {
    this.dataService.destroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLayoutChange(layout: 'list' | 'grid'): void {
    this.currentLayout.set(layout);
    const rows = getRowsPerPage(layout);
    this.dataService.loadPage(1, rows);
  }

  onLazyLoad(event: { first: number; rows: number }): void {
    if (this.dataService.shouldLoadPage()) {
      const page = calculatePage(event.first, event.rows);
      const rows = getRowsPerPage(this.currentLayout());
      this.dataService.loadPage(page, rows);
    }
  }
}
