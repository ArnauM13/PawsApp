import { Component, Input, input, TemplateRef } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';

export type DataViewLayout = 'list' | 'grid';

@Component({
  selector: 'fp-data-view',
  standalone: true,
  imports: [DataViewModule, SelectButtonModule, FormsModule, NgTemplateOutlet],
  template: `
    <p-dataview [value]="dataItems()" [layout]="currentLayout">

      <ng-template #header>
        <div class="flex justify-end">
          <p-selectbutton
            [(ngModel)]="currentLayout"
            [options]="layoutOptions"
            [allowEmpty]="false">
            <ng-template #item let-item>
              <i [class]="item === 'list' ? 'pi pi-bars' : 'pi pi-th-large'"></i>
            </ng-template>
          </p-selectbutton>
        </div>
      </ng-template>

      <ng-template #list let-items>
        @for (item of items; track item.id) {
          <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }" />
        }
      </ng-template>

      <ng-template #grid let-items>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
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
  layout = input<DataViewLayout>('grid');

  currentLayout: DataViewLayout = 'grid';
  layoutOptions: DataViewLayout[] = ['list', 'grid'];

  @Input({required: true}) itemTemplate!: TemplateRef<any>;
}
