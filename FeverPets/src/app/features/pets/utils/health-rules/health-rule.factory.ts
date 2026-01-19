import { Injectable } from '@angular/core';
import { HealthStatus, Pet } from '@features/pets/models';
import { HealthRule } from './health-rule.interface';
import { CatHealthRule } from './cat-health.rule';
import { DefaultHealthRule } from './default-health.rule';

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

  registerRule(rule: HealthRule): void {
    this.rules.push(rule);
  }

  getRule(pet: Pet): HealthRule {
    const rule = this.rules.find(r => r.appliesTo(pet));

    if (!rule) {
      return this.rules[this.rules.length - 1] || new DefaultHealthRule();
    }

    return rule;
  }

  calculateHealth(pet: Pet): HealthStatus {
    const rule = this.getRule(pet);
    return rule.calculateHealth(pet);
  }
}
