import { Component, input, effect, computed, TemplateRef, output, signal } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { PaginatorModule } from 'primeng/paginator';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PAGINATION_CONFIG } from '../../utils/pagination.constants';

/**
 * The layout of the data view.
 */
export type DataViewLayout = 'list' | 'grid';

/**
 * Component to display data in a list or grid view.
 *
 * @param dataItems - The data to display (array of items)
 * @param layout - The layout to use (list or grid)
 * @param listItemTemplate - The template to use for the list item
 * @param gridItemTemplate - The template to use for the grid item
 * @param listSkeletonTemplate - Optional template for list skeleton loading state
 * @param gridSkeletonTemplate - Optional template for grid skeleton loading state
 * @returns The data view component
 */
@Component({
  selector: 'fp-data-view',
  standalone: true,
  imports: [DataViewModule, PaginatorModule, SelectButtonModule, SelectModule, FormsModule, NgTemplateOutlet, TranslateModule],
  template: `
    @if (isLoading() || hasResults()) {
      <p-dataview
        [value]="dataItems()"
        [layout]="currentLayout()"
        [paginator]="hasResults()"
        [rows]="rowsPerPage()"
        [lazy]="lazy()"
        [totalRecords]="totalRecords()"
        [sortField]="sortField()"
        [sortOrder]="sortOrder()"
        (onLazyLoad)="onLazyLoad($event)"
        emptyMessage=" ">

        @if (hasResults()) {
          <ng-template #header>
            <div class="flex flex-col md:flex-row md:justify-between gap-4">
              @if (headerTemplate()) {
                <ng-container *ngTemplateOutlet="headerTemplate()!" />
              }
              <div class="flex justify-end">
                <p-selectbutton
                  [ngModel]="currentLayout()"
                  [options]="layoutOptions"
                  [allowEmpty]="false"
                  (ngModelChange)="onLayoutChangeFromButton($event)">
                  <ng-template #item let-item>
                    <i [class]="item === 'list' ? 'pi pi-bars' : 'pi pi-th-large'"></i>
                  </ng-template>
                </p-selectbutton>
              </div>
            </div>
          </ng-template>
        }

        <ng-template #list let-items>
          @if (isLoading()) {
            @if (listSkeletonTemplate()) {
              @for (i of skeletonArray(); track i) {
                <ng-container *ngTemplateOutlet="listSkeletonTemplate()!" />
              }
            }
          } @else {
            @for (item of items; track item.id) {
              <ng-container *ngTemplateOutlet="listItemTemplate(); context: { $implicit: item }" />
            }
          }
        </ng-template>

        <ng-template #grid let-items>
          @if (isLoading()) {
            @if (gridSkeletonTemplate()) {
              <div [class]="gridContainerClass">
                @for (i of skeletonArray(); track i) {
                  <ng-container *ngTemplateOutlet="gridSkeletonTemplate()!" />
                }
              </div>
            }
          } @else {
            <div [class]="gridContainerClass">
              @for (item of items; track item.id) {
                <ng-container *ngTemplateOutlet="gridItemTemplate(); context: { $implicit: item }" />
              }
            </div>
          }
        </ng-template>

      </p-dataview>
    } @else {
      <div class="flex items-center justify-center p-8">
        <p class="text-gray-500">{{ 'COMMON.NO_DATA' | translate }}</p>
      </div>
    }
  `
})
export class DataViewComponent<T> {
  dataItems = input.required<T[]>();
  layout = input<DataViewLayout>('grid');
  rows = input<number>(6);
  totalRecords = input<number>(0);
  isLoading = input<boolean>(false);
  sortField = input<string | undefined>(undefined);
  sortOrder = input<number | undefined>(undefined);
  lazy = input<boolean>(true);

  listItemTemplate = input.required<TemplateRef<{ $implicit: T }>>();
  gridItemTemplate = input.required<TemplateRef<{ $implicit: T }>>();

  listSkeletonTemplate = input<TemplateRef<void>>();
  gridSkeletonTemplate = input<TemplateRef<void>>();
  headerTemplate = input<TemplateRef<void>>();

  lazyLoad = output<{ first: number; rows: number }>();
  layoutChange = output<DataViewLayout>();

  layoutOptions: DataViewLayout[] = ['list', 'grid'];

  currentLayout = computed(() => this.layout());

  rowsPerPage = computed(() => {
    if (this.rows() !== undefined) {
      return this.rows()!;
    }
    return PAGINATION_CONFIG[this.currentLayout()];
  });

  skeletonArray = computed(() => {
    return Array(this.rowsPerPage()).fill(0).map((_, i) => i);
  });

  hasResults = computed(() => {
    return !this.isLoading() && this.dataItems().length > 0;
  });

  readonly gridContainerClass = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4';

  onLayoutChangeFromButton(newLayout: DataViewLayout): void {
    this.layoutChange.emit(newLayout);
  }

  onLazyLoad(event: { first: number; rows: number }): void {
    this.lazyLoad.emit(event);
  }
}
