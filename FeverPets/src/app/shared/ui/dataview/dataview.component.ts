import { Component, Input, input, TemplateRef } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { NgTemplateOutlet } from '@angular/common';

export type DataViewLayout = 'list' | 'grid';

@Component({
  selector: 'fp-data-view',
  standalone: true,
  imports: [DataViewModule, NgTemplateOutlet],
  template: `
    <div class="card">
      <p-dataview [value]="dataItems()" [layout]="layout()">

        <ng-template #header>
          @if (headerTemplate) {
            <ng-container *ngTemplateOutlet="headerTemplate" />
          }
        </ng-template>

        <ng-template #list let-items>
          @for (item of items; track item.id) {
            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }" />
          }
        </ng-template>

        <ng-template #grid let-items>
          @for (item of items; track item.id) {
            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }" />
          }
        </ng-template>

      </p-dataview>
    </div>
  `,
  styles: [`
    .empty-state {
      padding: 2rem;
      text-align: center;
      color: #666;
    }
  `]
})
export class DataViewComponent<T> {
  dataItems = input<T[]>([]);
  layout = input<DataViewLayout>('list');
  options = ['list', 'grid'];

  @Input() headerTemplate?: TemplateRef<any>;
  @Input({required: true}) itemTemplate!: TemplateRef<any>;
}
