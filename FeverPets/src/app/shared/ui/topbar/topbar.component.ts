import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { TranslateModule } from '@ngx-translate/core';
import { APP_CONFIG } from '@core/config';
import { LanguageDropdownComponent } from '@shared/ui/language-dropdown';

@Component({
  selector: 'fp-topbar',
  standalone: true,
  imports: [MenubarModule, RouterModule, TranslateModule, CommonModule, LanguageDropdownComponent],
  template: `
    <p-menubar>
      <ng-template pTemplate="start">
        <div class="flex items-center gap-3">
          @if (showBackButton()) {
            <button
              (click)="onBackClick()"
              class="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded transition-colors cursor-pointer mr-2"
              type="button"
              style="color: #374151;">
              <i class="pi pi-arrow-left" style="font-size: 1.25rem; color: inherit;"></i>
            </button>
          }
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
        @if (showLanguageDropdown()) {
          <fp-language-dropdown />
        }
      </ng-template>
    </p-menubar>
  `,
})
export class TopbarComponent {
  logoPath = APP_CONFIG.logoPath;
  showBackButton = input<boolean>(false);
  showLanguageDropdown = input<boolean>(true);
  backClick = output<void>();

  protected onBackClick(): void {
    this.backClick.emit();
  }
}
