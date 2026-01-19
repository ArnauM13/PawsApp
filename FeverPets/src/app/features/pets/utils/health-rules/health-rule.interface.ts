import { HealthStatus, Pet } from '@features/pets/models';

export interface HealthRule {
  appliesTo(pet: Pet): boolean;
  calculateHealth(pet: Pet): HealthStatus;
}
