import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PetHealthBadgeComponent } from './pet-health-badge.component';

describe('PetHealthBadgeComponent', () => {
  let component: PetHealthBadgeComponent;
  let fixture: ComponentFixture<PetHealthBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetHealthBadgeComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PetHealthBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have badgeInfo computed property', () => {
    expect(component.badgeInfo).toBeDefined();
  });
});
