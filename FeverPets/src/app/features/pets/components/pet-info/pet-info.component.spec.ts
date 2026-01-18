import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PetInfoComponent } from './pet-info.component';
import { Pet } from '@features/pets/models';

describe('PetInfoComponent', () => {
  let component: PetInfoComponent;
  let fixture: ComponentFixture<PetInfoComponent>;

  const mockPet: Pet = {
    id: 1,
    name: 'Fluffy',
    kind: 'Cat',
    weight: 4.5,
    height: 25,
    length: 30,
    photo_url: 'https://example.com/fluffy.jpg',
    description: 'A fluffy cat',
    number_of_lives: 9
  };

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

  it('should compute healthStatus correctly', () => {
    fixture.componentRef.setInput('pet', mockPet);
    fixture.detectChanges();

    expect(component.healthStatus()).toBeDefined();
  });
});
