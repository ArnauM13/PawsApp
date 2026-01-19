import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PetOfTheDayComponent } from './pet-of-the-day.component';
import { PetOfTheDayStore } from '@features/pets/store';
import { Pet } from '@features/pets/models';

describe('PetOfTheDayComponent', () => {
  let component: PetOfTheDayComponent;
  let fixture: ComponentFixture<PetOfTheDayComponent>;
  let store: PetOfTheDayStore;

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
    const mockStore = {
      pet: vi.fn(() => mockPet),
      loading: vi.fn(() => false),
      error: vi.fn(() => null),
      load: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [PetOfTheDayComponent, TranslateModule.forRoot()],
      providers: [
        { provide: PetOfTheDayStore, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PetOfTheDayComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(PetOfTheDayStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pet of the day on init', () => {
    component.ngOnInit();
    expect(store.load).toHaveBeenCalled();
  });

  it('should use logoPath from APP_CONFIG', () => {
    expect(component['logoPath']).toBe('images/logo.png');
  });

  it('should toggle isOpen state', () => {
    const initialValue = component['isOpen']();
    component['toggle']();
    expect(component['isOpen']()).toBe(!initialValue);
  });
});
