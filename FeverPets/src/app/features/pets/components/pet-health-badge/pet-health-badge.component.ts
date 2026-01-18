import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HealthStatus } from '../../models/pet.model';
import { getHealthBadgeInfo } from '../../utils/pet-health.util';

/**
 * Component to display pet health status with visual badge.
 *
 * @param healthStatus - The health status of the pet
 * @returns The pet health badge component
 */
@Component({
  selector: 'fp-pet-health-badge',
  standalone: true,
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
