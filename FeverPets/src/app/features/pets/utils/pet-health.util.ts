import { HealthStatus, Pet } from '@features/pets/models';
import { HealthRuleFactory } from './health-rules';

export interface HealthBadgeInfo {
  status: HealthStatus;
  cssClasses: string;
  translationKey: string;
}

let healthRuleFactoryInstance: HealthRuleFactory | null = null;

/**
 * Gets or creates a singleton instance of HealthRuleFactory.
 *
 * This ensures we use the same factory instance throughout the application,
 * maintaining consistency in health calculation rules.
 *
 * @returns The singleton HealthRuleFactory instance
 * @internal
 */
function getHealthRuleFactory(): HealthRuleFactory {
  if (!healthRuleFactoryInstance) {
    healthRuleFactoryInstance = new HealthRuleFactory();
  }
  return healthRuleFactoryInstance;
}

/**
 * Calculates the health status of a pet based on its characteristics.
 *
 * Uses the HealthRuleFactory to select the appropriate rule for the pet type.
 * The factory pattern allows different pet types (e.g., cats, dogs) to have
 * different health calculation rules without modifying this function.
 *
 * @param pet - The pet to calculate health for
 * @returns The health status: 'unhealthy' | 'healthy' | 'very healthy'
 *
 * @example
 * ```typescript
 * const health = calculateHealth({
 *   kind: 'cat',
 *   weight: 5000,
 *   height: 30,
 *   length: 40,
 *   number_of_lives: 1
 * });
 * // Returns 'unhealthy' because cat with 1 life is always unhealthy
 * ```
 */
export function calculateHealth(pet: Pet): HealthStatus {
  const factory = getHealthRuleFactory();
  return factory.calculateHealth(pet);
}

/**
 * Gets the badge configuration for a given health status.
 *
 * Returns CSS classes and translation key for displaying the health status
 * in the UI with appropriate styling (colors, badges, etc.).
 *
 * @param healthStatus - The health status to get badge info for
 * @returns Configuration object with CSS classes and translation key
 *
 * @example
 * ```typescript
 * const badgeInfo = getHealthBadgeInfo('very healthy');
 * // Returns: {
 * //   status: 'very healthy',
 * //   cssClasses: 'bg-green-100 text-green-800',
 * //   translationKey: 'PETS.HEALTH.VERY_HEALTHY'
 * // }
 * ```
 */
export function getHealthBadgeInfo(healthStatus: HealthStatus): HealthBadgeInfo {
  const statusConfig: Record<HealthStatus, { cssClasses: string; translationKey: string }> = {
    'very healthy': {
      cssClasses: 'bg-green-100 text-green-800',
      translationKey: 'PETS.HEALTH.VERY_HEALTHY'
    },
    'healthy': {
      cssClasses: 'bg-blue-100 text-blue-800',
      translationKey: 'PETS.HEALTH.HEALTHY'
    },
    'unhealthy': {
      cssClasses: 'bg-red-100 text-red-800',
      translationKey: 'PETS.HEALTH.UNHEALTHY'
    }
  };

  const config = statusConfig[healthStatus] || {
    cssClasses: 'bg-gray-100 text-gray-800',
    translationKey: 'PETS.HEALTH.UNHEALTHY'
  };

  return {
    status: healthStatus,
    cssClasses: config.cssClasses,
    translationKey: config.translationKey
  };
}
