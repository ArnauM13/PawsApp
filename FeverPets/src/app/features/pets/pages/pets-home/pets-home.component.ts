import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectItem } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { PetCardComponent, PetListItemComponent, PetOfTheDayComponent } from '@features/pets/components';
import { PetsLayoutService } from '@features/pets/services';
import { PetsListStore } from '@features/pets/store';
import { calculatePage, calculateFirst, getRowsPerPage } from '@shared/utils';
import { DataViewComponent, TopbarComponent } from '@shared/ui';

@Component({
  selector: 'pa-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataViewComponent,
    PetCardComponent,
    PetListItemComponent,
    PetOfTheDayComponent,
    TopbarComponent,
    TranslateModule,
    SkeletonModule,
    SelectModule,
    ButtonModule,
    FormsModule
  ],
  template: `
  <div class="flex flex-col h-screen p-2">

    <pa-topbar />

    <pa-pet-of-the-day />

      <pa-data-view
      [dataItems]="store.pets()"
      [totalRecords]="store.total()"
      [isLoading]="store.loading()"
      [layout]="layoutService.layout()"
      [rows]="rowsPerPage()"
      [first]="currentFirst()"
      [sortField]="currentSortField()"
      [sortOrder]="currentSortOrder()"
      [lazy]="true"
      [headerTemplate]="headerTemplate"
      [listItemTemplate]="listItemTemplate"
      [gridItemTemplate]="gridItemTemplate"
      [listSkeletonTemplate]="listSkeletonTemplate"
      [gridSkeletonTemplate]="gridSkeletonTemplate"
      (lazyLoad)="onLazyLoad($event)"
      (layoutChange)="onLayoutChange($event)">

      <ng-template #headerTemplate>
        <div class="flex flex-col md:flex-row gap-2 items-start md:items-center">
          <p-select
            [options]="sortOptions"
            [(ngModel)]="sortKey"
            optionLabel="label"
            optionValue="value"
            [placeholder]="'PETS.SORT.BY' | translate"
            (onChange)="onSortChange($event)"
            class="w-full md:w-auto" />
          @if (hasSorting()) {
            <p-button
              icon="pi pi-times"
              [label]="'PETS.SORT.RESET' | translate"
              [outlined]="true"
              severity="secondary"
              (onClick)="resetSort()"
              class="w-full md:w-auto" />
          }
        </div>
      </ng-template>

      <ng-template #listItemTemplate let-pet>
        <pa-pet-list-item [pet]="pet" />
      </ng-template>
      <ng-template #gridItemTemplate let-pet>
        <pa-pet-card [pet]="pet" />
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
    </pa-data-view>
  </div>
  `,
})
export class PetsHomeComponent implements OnInit, OnDestroy {
  protected readonly store = inject(PetsListStore);
  protected readonly layoutService = inject(PetsLayoutService);
  private readonly translate = inject(TranslateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  protected sortOptions: SelectItem[] = [];

  protected readonly currentSortField = computed(() => {
    const query = this.store.getCurrentQuery();
    return query.sortField;
  });

  protected readonly currentSortOrder = computed(() => {
    const query = this.store.getCurrentQuery();
    if (!query.sortOrder) return undefined;

    return query.sortOrder === 'asc' ? 1 : -1;
  });

  protected readonly hasSorting = computed(() => {
    return !!this.currentSortField();
  });

  protected get sortKey(): string | undefined {
    const sortField = this.currentSortField();
    const sortOrder = this.currentSortOrder();

    if (!sortField || !sortOrder) {
      return undefined;
    }

    const isDesc = sortOrder === -1;
    return isDesc ? `!${sortField}` : sortField;
  }

  protected set sortKey(value: string | undefined) {
    if (value) {
      const isDesc = value.startsWith('!');
      const sortField = isDesc ? value.substring(1) : value;
      const sortOrder: 'asc' | 'desc' = isDesc ? 'desc' : 'asc';
      this.store.setSorting(sortField, sortOrder);
    } else {
      this.store.clearSorting();
    }
  }

  protected readonly rowsPerPage = computed(() => {
    return getRowsPerPage(this.layoutService.layout());
  });

  protected readonly currentFirst = computed(() => {
    const query = this.store.getCurrentQuery();
    const page = query.page || 1;
    const rows = this.rowsPerPage();
    return calculateFirst(page, rows);
  });

  ngOnInit(): void {
    this.initializeSortOptions();
    this.translate.onLangChange.subscribe(() => {
      this.initializeSortOptions();
    });

    this.route.queryParams.pipe(
      take(1),
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const page = params['page'] ? Number(params['page']) : 1;
      const sort = params['sort'] as string | undefined;
      const order = (params['order'] === 'asc' || params['order'] === 'desc')
        ? params['order'] as 'asc' | 'desc'
        : undefined;
      const rawLayout = params['layout'];
      const layout = (rawLayout === 'list' || rawLayout === 'grid') ? rawLayout : 'grid';

      this.layoutService.setLayout(layout);
      this.store.updateQuery({ page, sortField: sort, sortOrder: order, limit: this.rowsPerPage() }, true);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.sortKey = event.value as string | undefined;
    this.syncToUrl();
  }

  resetSort(): void {
    this.sortKey = undefined;
    this.syncToUrl();
  }

  onLayoutChange(layout: 'list' | 'grid'): void {
    this.layoutService.setLayout(layout);
    const rows = getRowsPerPage(layout);

    this.store.updateQuery({
      page: 1,
      limit: rows
    });
    this.syncToUrl();
  }

  onLazyLoad(event: { first: number; rows: number }): void {
    const rows = this.rowsPerPage();
    const page = calculatePage(event.first, rows);

    this.store.updateQuery({ page, limit: rows });
    this.syncToUrl();
  }

  private syncToUrl(): void {
    const query = this.store.getCurrentQuery();
    const layout = this.layoutService.layout();
    const queryParams: Record<string, string> = {};
    if ((query.page ?? 1) > 1) queryParams['page'] = String(query.page);
    if (query.sortField) queryParams['sort'] = query.sortField;
    if (query.sortOrder) queryParams['order'] = query.sortOrder;
    if (layout !== 'grid') queryParams['layout'] = layout;
    this.router.navigate([], { relativeTo: this.route, queryParams, replaceUrl: true });
  }
}
