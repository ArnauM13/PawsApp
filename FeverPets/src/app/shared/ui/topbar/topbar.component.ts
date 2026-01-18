import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageDropdownComponent } from '../language-dropdown/language-dropdown.component';

@Component({
  selector: 'fp-topbar',
  standalone: true,
  imports: [MenubarModule, TranslateModule, LanguageDropdownComponent],
  template: `
    <p-menubar [model]="items">
      <ng-template pTemplate="start">
        <span class="font-bold text-xl">
          {{ 'APP.TITLE' | translate }}
        </span>
      </ng-template>

      <ng-template pTemplate="end">
        <fp-language-dropdown></fp-language-dropdown>
      </ng-template>
    </p-menubar>
  `,
})
export class TopbarComponent {
  items = [
    {
      label: 'Pets',
      icon: 'pi pi-home',
      routerLink: '/'
    }
  ];
}
