import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { APP_CONFIG } from '@core/config';
import { PetInfoComponent } from '@features/pets/components';
import { Pet } from '@features/pets/models';
import { PetsApi } from '@features/pets/api';
import { PetsLayoutService } from '@features/pets/services';
import { PetsListStore } from '@features/pets/store';
import { ImageFallbackDirective } from '@shared/directives';
import { TopbarComponent } from '@shared/ui';

@Component({
  selector: 'pa-pet-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    PetInfoComponent,
    TopbarComponent,
    ImageFallbackDirective
  ],
  template: `
    <div class="flex flex-col h-screen p-2">
      <pa-topbar [showBackButton]="true" [showLanguageDropdown]="false" (backClick)="goBack()" />

      <div class="flex-1 overflow-y-auto p-5">
        @if (isLoading()) {
          <div class="flex items-center justify-center h-full">
            <p class="text-gray-500">{{ 'COMMON.LOADING' | translate }}...</p>
          </div>
        } @else if (pet()) {
          <div class="max-w-4xl mx-auto p-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="shrink-0">
                <img
                  [src]="pet()!.photo_url"
                  [alt]="pet()!.name"
                  [fpImageFallback]="logoPath"
                  class="w-full h-auto rounded-lg object-cover shadow-lg" />
              </div>

              <div class="flex flex-col gap-6">
                <div>
                  <h1 class="text-4xl font-bold mb-4">{{ pet()!.name }}</h1>
                  <pa-pet-info [pet]="pet()!" layout="grid" />
                </div>

                @if (pet()!.description) {
                  <div class="border-t border-surface-200 pt-6">
                  <h2 class="text-2xl font-bold mb-4">{{ 'PETS.DESCRIPTION' | translate }}</h2>
                    <p class="text-gray-700 leading-relaxed">
                      {{ pet()!.description }}
                    </p>
                  </div>
                }
              </div>
            </div>
          </div>
        } @else {
          <div class="flex items-center justify-center h-full">
            <p class="text-gray-500">{{ 'PETS.NOT_FOUND' | translate }}</p>
          </div>
        }
      </div>
    </div>
  `
})
export class PetDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(PetsApi);
  private readonly store = inject(PetsListStore);
  private readonly layoutService = inject(PetsLayoutService);
  private readonly destroy$ = new Subject<void>();

  protected readonly pet = signal<Pet | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly logoPath = APP_CONFIG.logoPath;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const petId = params.get('id');
          if (!petId) {
            this.pet.set(null);
            this.isLoading.set(false);
            return EMPTY;
          }

          this.pet.set(null);
          this.isLoading.set(true);

          return this.api.getById(parseInt(petId, 10));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (pet) => {
          this.pet.set(pet);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading pet:', error);
          this.pet.set(null);
          this.isLoading.set(false);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected goBack(): void {
    const query = this.store.getCurrentQuery();
    const layout = this.layoutService.layout();
    const queryParams: Record<string, string> = {};
    if ((query.page ?? 1) > 1) queryParams['page'] = String(query.page);
    if (query.sortField) queryParams['sort'] = query.sortField;
    if (query.sortOrder) queryParams['order'] = query.sortOrder;
    if (layout !== 'grid') queryParams['layout'] = layout;
    this.router.navigate(['/'], { queryParams });
  }
}
