import { Injectable } from '@angular/core';
import { HealthStatus, Pet } from '@features/pets/models';
import { HealthRule } from './health-rule.interface';
import { CatHealthRule } from './cat-health.rule';
import { DefaultHealthRule } from './default-health.rule';

/**
 * Factory for selecting and applying health calculation rules based on pet type.
 *
 * This factory implements the Strategy Pattern, allowing different pet types
 * to have different health calculation rules. Rules are registered in order
 * of specificity (most specific first), and the first matching rule is used.
 *
 * This design follows the Open/Closed Principle: open for extension (new rules),
 * closed for modification (no need to change this factory when adding new pet types).
 */
@Injectable({
  providedIn: 'root'
})
export class HealthRuleFactory {
  private readonly rules: HealthRule[] = [];

  constructor() {
    // Register rules in order of specificity (most specific first)
    this.registerRule(new CatHealthRule());
    this.registerRule(new DefaultHealthRule());
  }

  /**
   * Registers a new health rule.
   *
   * Rules should be registered in order of specificity, with the most specific
   * rules first. The factory will use the first rule that applies to a pet.
   *
   * @param rule - The health rule to register
   *
   * @example
   * ```typescript
   * factory.registerRule(new BirdHealthRule());
   * ```
   */
  registerRule(rule: HealthRule): void {
    this.rules.push(rule);
  }

  /**
   * Gets the appropriate health rule for a given pet.
   *
   * Searches through registered rules in order and returns the first one
   * that applies to the pet. If no rule matches, returns the default rule.
   *
   * @param pet - The pet to get a rule for
   * @returns The health rule that applies to this pet
   *
   * @internal
   */
  getRule(pet: Pet): HealthRule {
    const rule = this.rules.find(r => r.appliesTo(pet));

    if (!rule) {
      return this.rules[this.rules.length - 1] || new DefaultHealthRule();
    }

    return rule;
  }

  /**
   * Calculates the health status of a pet using the appropriate rule.
   *
   * This is the main public method that should be used to calculate pet health.
   * It automatically selects the correct rule based on the pet type.
   *
   * @param pet - The pet to calculate health for
   * @returns The health status: 'unhealthy' | 'healthy' | 'very healthy'
   *
   * @example
   * ```typescript
   * const health = factory.calculateHealth(cat);
   * // Uses CatHealthRule if pet is a cat, otherwise DefaultHealthRule
   * ```
   */
  calculateHealth(pet: Pet): HealthStatus {
    const rule = this.getRule(pet);
    return rule.calculateHealth(pet);
  }
}
