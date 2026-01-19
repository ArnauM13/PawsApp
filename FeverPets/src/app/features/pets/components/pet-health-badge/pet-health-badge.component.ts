import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HealthStatus } from '@features/pets/models';
import { getHealthBadgeInfo } from '@features/pets/utils';

/**
 * Component to display pet health status with visual badge.
 *
 * @param healthStatus - The health status of the pet
 * @returns The pet health badge component
 */
@Component({
  selector: 'fp-pet-health-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateModule],
  template: `
    <span
      [class]="badgeInfo().cssClasses"
      class="px-2 py-1 rounded text-xs font-semibold">
      {{ badgeInfo().translationKey | translate }}
    </span>
  `
})
export class PetHealthBadgeComponent {
  healthStatus = input.required<HealthStatus>();

  badgeInfo = computed(() => getHealthBadgeInfo(this.healthStatus()));
}
