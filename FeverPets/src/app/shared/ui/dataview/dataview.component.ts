import { Component, Input, input, TemplateRef } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { NgTemplateOutlet } from '@angular/common';

export type DataViewLayout = 'list' | 'grid';

@Component({
  selector: 'fp-data-view',
  standalone: true,
  imports: [DataViewModule, NgTemplateOutlet],
  template: `
    <p-dataview [value]="dataItems()" [layout]="layout()">

      <ng-template #header>
        @if (headerTemplate) {
          <ng-container *ngTemplateOutlet="headerTemplate" />
        }
      </ng-template>

      <!-- <ng-template #list let-items>
        @for (item of items; track item.id) {
          <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }" />
        }
      </ng-template> -->

      <ng-template #grid let-items>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        @for (item of items; track item.id) {
            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }" />
        }
        </div>
      </ng-template>

    </p-dataview>
  `
})
export class DataViewComponent<T> {
  dataItems = input<T[]>([]);
  layout = input<DataViewLayout>('list');
  options = ['list', 'grid'];

  @Input({required: true}) itemTemplate!: TemplateRef<any>;

  @Input() headerTemplate?: TemplateRef<any>;
}
