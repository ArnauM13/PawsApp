import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { LanguageDropdownComponent } from '@shared/ui/language-dropdown';

/**
 * Component to display the topbar.
 *
 * @returns The topbar component
 */
@Component({
  selector: 'fp-topbar',
  standalone: true,
  imports: [MenubarModule, TranslateModule, CommonModule, LanguageDropdownComponent],
  template: `
    <p-menubar>
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
        <fp-language-dropdown />
      </ng-template>
    </p-menubar>
  `,
})
export class TopbarComponent {
  logoPath = 'images/logo.png';
}
