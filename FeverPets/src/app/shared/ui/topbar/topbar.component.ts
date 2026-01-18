import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { LanguageDropdownComponent } from '../language-dropdown/language-dropdown.component';

@Component({
  selector: 'fp-topbar',
  standalone: true,
  imports: [MenubarModule, TranslateModule, CommonModule, LanguageDropdownComponent],
  template: `
    <p-menubar [model]="items">
      <ng-template pTemplate="start">
        <div class="flex items-center gap-3">
          <img
            [src]="logoPath"
            alt="FeverPets Logo"
            class="h-8 w-8 object-contain">
          <span class="font-bold text-xl">
            {{ 'APP.TITLE' | translate }}
          </span>
        </div>
      </ng-template>

      <ng-template pTemplate="end">
        <fp-language-dropdown></fp-language-dropdown>
      </ng-template>
    </p-menubar>
  `,
})
export class TopbarComponent {
  logoPath = 'images/logo.png';

  items = [
    {
      label: 'Pets',
      icon: 'pi pi-home',
      routerLink: '/'
    }
  ];
}
