import { HealthStatus, Pet } from '@features/pets/models';
import { HealthRule } from './health-rule.interface';
import { DefaultHealthRule } from './default-health.rule';

export class CatHealthRule implements HealthRule {
  private readonly defaultRule = new DefaultHealthRule();

  appliesTo(pet: Pet): boolean {
    return pet.kind.toLowerCase() === 'cat';
  }

  calculateHealth(pet: Pet): HealthStatus {
    // Business rule: Cat with 1 life is always unhealthy
    if (pet.number_of_lives === 1) {
      return 'unhealthy';
    }

    return this.defaultRule.calculateHealth(pet);
  }
}
