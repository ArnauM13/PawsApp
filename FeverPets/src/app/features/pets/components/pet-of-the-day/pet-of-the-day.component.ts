import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { APP_CONFIG } from '@core/config';
import { PetOfTheDayStore } from '@features/pets/store';
import { ImageFallbackDirective } from '@shared/directives';

@Component({
  selector: 'fp-pet-of-the-day',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    ImageFallbackDirective
  ],
  template: `
    <div class="fixed bottom-4 right-4 z-50">
      @if (!isOpen()) {
        <button
          (click)="toggle()"
          class="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors cursor-pointer">
          <i class="pi pi-star"></i>
          <span>{{ 'PETS.PET_OF_THE_DAY' | translate }}</span>
        </button>
      } @else if (store.pet()) {
        <div class="w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div class="p-3 bg-blue-500 text-white flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-semibold">{{ 'PETS.PET_OF_THE_DAY' | translate }}</span>
              <span class="text-xs opacity-90">{{ currentDate() }}</span>
            </div>
            <button
              (click)="toggle()"
              class="p-1 hover:bg-blue-600 rounded transition-colors cursor-pointer">
              <i class="pi pi-times text-sm"></i>
            </button>
          </div>
          <div class="p-3">
            @if (store.loading()) {
              <div class="w-full h-32 bg-gray-200 animate-pulse rounded mb-2"></div>
            } @else if (store.pet()) {
              <img
                [src]="store.pet()!.photo_url"
                [alt]="store.pet()!.name"
                [fpImageFallback]="logoPath"
                class="w-full h-32 object-cover rounded mb-2" />
              <h3 class="text-lg font-bold text-center mb-2">{{ store.pet()!.name }}</h3>
              <a
                [routerLink]="['/pet', store.pet()!.id]"
                class="block w-full px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-center text-sm transition-colors cursor-pointer">
                {{ 'PETS.SEE_MORE' | translate }}
              </a>
            }
          </div>
        </div>
      } @else if (store.error()) {
        <div class="w-64 bg-white rounded-lg shadow-lg border border-red-200 overflow-hidden p-3">
          <p class="text-red-600 text-sm">{{ store.error() }}</p>
        </div>
      }
    </div>
  `
})
export class PetOfTheDayComponent implements OnInit {
  protected readonly store = inject(PetOfTheDayStore);
  protected readonly isOpen = signal<boolean>(false);
  protected readonly currentDate = signal<string>('');
  protected readonly logoPath = APP_CONFIG.logoPath;

  ngOnInit(): void {
    this.updateCurrentDate();
    this.store.load();
  }

  protected toggle(): void {
    this.isOpen.update(value => !value);
  }

  private updateCurrentDate(): void {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    this.currentDate.set(today.toLocaleDateString(undefined, options));
  }
}
