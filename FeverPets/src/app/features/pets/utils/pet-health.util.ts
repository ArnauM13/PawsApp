import { HealthStatus, Pet } from '@features/pets/models';
import { HealthRuleFactory } from './health-rules';

export interface HealthBadgeInfo {
  status: HealthStatus;
  cssClasses: string;
  translationKey: string;
}

let healthRuleFactoryInstance: HealthRuleFactory | null = null;

function getHealthRuleFactory(): HealthRuleFactory {
  if (!healthRuleFactoryInstance) {
    healthRuleFactoryInstance = new HealthRuleFactory();
  }
  return healthRuleFactoryInstance;
}

export function calculateHealth(pet: Pet): HealthStatus {
  const factory = getHealthRuleFactory();
  return factory.calculateHealth(pet);
}

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
