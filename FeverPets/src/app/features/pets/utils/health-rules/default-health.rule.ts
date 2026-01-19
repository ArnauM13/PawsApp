import { HealthStatus, Pet } from '@features/pets/models';
import { HealthRule } from './health-rule.interface';

export class DefaultHealthRule implements HealthRule {
  appliesTo(pet: Pet): boolean {
    return true;
  }

  calculateHealth(pet: Pet): HealthStatus {
    // Health formula: weight / (height * length)
    // - 'unhealthy': below 2 or over 5
    // - 'very healthy': between 2 and 3
    // - 'healthy': between 3 and 5
    const healthRatio = pet.weight / (pet.height * pet.length);

    if (healthRatio < 2 || healthRatio > 5) {
      return 'unhealthy';
    } else if (healthRatio >= 2 && healthRatio < 3) {
      return 'very healthy';
    } else {
      return 'healthy';
    }
  }
}
