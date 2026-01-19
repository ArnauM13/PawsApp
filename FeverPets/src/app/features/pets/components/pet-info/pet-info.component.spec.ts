import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PetInfoComponent } from './pet-info.component';

describe('PetInfoComponent', () => {
  let component: PetInfoComponent;
  let fixture: ComponentFixture<PetInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetInfoComponent, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PetInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have healthStatus computed property', () => {
    expect(component.healthStatus).toBeDefined();
  });

  it('should have default layout as grid', () => {
    expect(component.layout()).toBe('grid');
  });
});
