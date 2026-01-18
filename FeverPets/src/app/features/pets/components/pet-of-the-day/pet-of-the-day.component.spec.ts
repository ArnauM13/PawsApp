import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { PetOfTheDayComponent } from './pet-of-the-day.component';
import { PetsService } from '@features/pets/services';
import { Pet } from '@features/pets/models';

describe('PetOfTheDayComponent', () => {
  let component: PetOfTheDayComponent;
  let fixture: ComponentFixture<PetOfTheDayComponent>;
  let petsService: PetsService;

  const mockPets: Pet[] = [
    {
      id: 1,
      name: 'Fluffy',
      kind: 'Cat',
      weight: 4.5,
      height: 25,
      length: 30,
      photo_url: 'https://example.com/fluffy.jpg',
      description: 'A fluffy cat',
      number_of_lives: 9
    }
  ];

  beforeEach(async () => {
    const petsServiceSpy = {
      getPets: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [PetOfTheDayComponent, TranslateModule.forRoot()],
      providers: [
        { provide: PetsService, useValue: petsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PetOfTheDayComponent);
    component = fixture.componentInstance;
    petsService = TestBed.inject(PetsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pet of the day on init', () => {
    (petsService.getPets as any).mockReturnValue(of(mockPets));

    component.ngOnInit();
    fixture.detectChanges();

    expect(petsService.getPets).toHaveBeenCalled();
    expect((component as any).petOfTheDay()).toBeTruthy();
  });

  it('should use logoPath from APP_CONFIG', () => {
    expect((component as any).logoPath).toBe('images/logo.png');
  });
});
