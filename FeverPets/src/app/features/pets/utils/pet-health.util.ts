import { Pet, HealthStatus } from '../models/pet.model';

export interface HealthBadgeInfo {
  status: HealthStatus;
  cssClasses: string;
  translationKey: string;
}

/**
 * Calculates the health status of a pet based on weight, height, length, and special rules.
 *
 * Health formula: weight / (height * length)
 * - 'unhealthy': below 2 or over 5
 * - 'healthy': between 3 and 5
 * - 'very healthy': between 2 and 3
 *
 * Special rule: If the pet is a cat with number_of_lives === 1, it's always 'unhealthy'
 */
export function calculateHealth(pet: Pet): HealthStatus {
  if (pet.kind.toLowerCase() === 'cat' && pet.number_of_lives === 1) {
    return 'unhealthy';
  }

  const healthRatio = pet.weight / (pet.height * pet.length);

  if (healthRatio < 2 || healthRatio > 5) {
    return 'unhealthy';
  } else if (healthRatio >= 2 && healthRatio < 3) {
    return 'very healthy';
  } else {
    return 'healthy';
  }
}

export function getHealthBadgeInfo(healthStatus: HealthStatus): HealthBadgeInfo {
  const statusConfig: Record<HealthStatus, { cssClasses: string; translationKey: string }> = {
    'very healthy': {
      cssClasses: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      translationKey: 'PETS.HEALTH.VERY_HEALTHY'
    },
    'healthy': {
      cssClasses: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      translationKey: 'PETS.HEALTH.HEALTHY'
    },
    'unhealthy': {
      cssClasses: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      translationKey: 'PETS.HEALTH.UNHEALTHY'
    }
  };

  const config = statusConfig[healthStatus] || {
    cssClasses: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    translationKey: 'PETS.HEALTH.UNHEALTHY'
  };

  return {
    status: healthStatus,
    cssClasses: config.cssClasses,
    translationKey: config.translationKey
  };
}
