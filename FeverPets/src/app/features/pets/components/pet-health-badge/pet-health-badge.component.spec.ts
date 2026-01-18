import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PetHealthBadgeComponent } from './pet-health-badge.component';
import type { HealthStatus } from '../../models/pet.model';

describe('PetHealthBadgeComponent', () => {
  let component: PetHealthBadgeComponent;
  let fixture: ComponentFixture<PetHealthBadgeComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetHealthBadgeComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PetHealthBadgeComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display badge for "very healthy" status', () => {
    fixture.componentRef.setInput('healthStatus', 'very healthy');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('span');
    expect(badge).toBeTruthy();
    expect(badge.className).toContain('bg-green-100');
    expect(badge.className).toContain('text-green-800');
  });

  it('should display badge for "healthy" status', () => {
    fixture.componentRef.setInput('healthStatus', 'healthy');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('span');
    expect(badge).toBeTruthy();
    expect(badge.className).toContain('bg-blue-100');
    expect(badge.className).toContain('text-blue-800');
  });

  it('should display badge for "unhealthy" status', () => {
    fixture.componentRef.setInput('healthStatus', 'unhealthy');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('span');
    expect(badge).toBeTruthy();
    expect(badge.className).toContain('bg-red-100');
    expect(badge.className).toContain('text-red-800');
  });

  it('should update badge when healthStatus changes', () => {
    fixture.componentRef.setInput('healthStatus', 'healthy');
    fixture.detectChanges();

    let badge = fixture.nativeElement.querySelector('span');
    expect(badge.className).toContain('bg-blue-100');

    fixture.componentRef.setInput('healthStatus', 'very healthy');
    fixture.detectChanges();

    badge = fixture.nativeElement.querySelector('span');
    expect(badge.className).toContain('bg-green-100');
  });

  it('should have correct CSS classes for badge styling', () => {
    fixture.componentRef.setInput('healthStatus', 'healthy');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('span');
    expect(badge.className).toContain('px-2');
    expect(badge.className).toContain('py-1');
    expect(badge.className).toContain('rounded');
    expect(badge.className).toContain('text-xs');
    expect(badge.className).toContain('font-semibold');
  });

  it('should compute badgeInfo correctly for each status', () => {
    fixture.componentRef.setInput('healthStatus', 'very healthy');
    fixture.detectChanges();
    expect(component.badgeInfo().status).toBe('very healthy');
    expect(component.badgeInfo().translationKey).toBe('PETS.HEALTH.VERY_HEALTHY');

    fixture.componentRef.setInput('healthStatus', 'healthy');
    fixture.detectChanges();
    expect(component.badgeInfo().status).toBe('healthy');
    expect(component.badgeInfo().translationKey).toBe('PETS.HEALTH.HEALTHY');

    fixture.componentRef.setInput('healthStatus', 'unhealthy');
    fixture.detectChanges();
    expect(component.badgeInfo().status).toBe('unhealthy');
    expect(component.badgeInfo().translationKey).toBe('PETS.HEALTH.UNHEALTHY');
  });
});
