import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PetsService } from '../../services/pets.service';
import { Pet } from '../../models/pet.model';
import { getPetOfTheDay } from '../../utils/pet-of-the-day.util';
import { CardComponent } from '@shared/ui';

@Component({
  selector: 'fp-pet-of-the-day',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    CardComponent
  ],
  template: `
    @if (petOfTheDay()) {
      <fp-card
        [contentTemplate]="contentTemplate"
        [titleTemplate]="titleTemplate">
        
        <ng-template #titleTemplate>
          <div class="flex flex-col gap-1">
            <span class="text-lg font-semibold">{{ 'PETS.PET_OF_THE_DAY' | translate }}</span>
            <span class="text-sm text-gray-500">{{ currentDate() }}</span>
          </div>
        </ng-template>

        <ng-template #contentTemplate>
          <div class="flex flex-col items-center gap-4">
            <img
              [src]="petOfTheDay()!.photo_url"
              [alt]="petOfTheDay()!.name"
              class="w-full h-64 object-cover rounded" />
            <h3 class="text-2xl font-bold">{{ petOfTheDay()!.name }}</h3>
            <a
              [routerLink]="['/pet', petOfTheDay()!.id]"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors cursor-pointer">
              {{ 'PETS.SEE_MORE' | translate }}
            </a>
          </div>
        </ng-template>
      </fp-card>
    }
  `
})
export class PetOfTheDayComponent implements OnInit, OnDestroy {
  private readonly petsService = inject(PetsService);
  private readonly destroy$ = new Subject<void>();

  protected readonly petOfTheDay = signal<Pet | null>(null);
  protected readonly currentDate = signal<string>('');

  ngOnInit(): void {
    this.updateCurrentDate();
    
    this.petsService.getPets()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pets) => {
          const pet = getPetOfTheDay(pets);
          this.petOfTheDay.set(pet);
        },
        error: (error) => {
          console.error('Error loading pets for pet of the day:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
