import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PetDetailComponent } from './pet-detail.component';
import { PetsService } from '@features/pets/services';

describe('PetDetailComponent', () => {
  let component: PetDetailComponent;
  let fixture: ComponentFixture<PetDetailComponent>;

  beforeEach(async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const petsServiceSpy = {
      getPetById: vi.fn()
    };

    // Mock ActivatedRoute with minimal setup
    const mockParamMap = {
      get: vi.fn(() => null),
      has: vi.fn(() => false),
      getAll: vi.fn(() => []),
      keys: []
    };

    await TestBed.configureTestingModule({
      imports: [PetDetailComponent, TranslateModule.forRoot()],
      providers: [
        { provide: PetsService, useValue: petsServiceSpy },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ActivatedRoute, useValue: { paramMap: { subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PetDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use logoPath from APP_CONFIG', () => {
    expect((component as any).logoPath).toBe('images/logo.png');
  });

  it('should have pet signal initialized', () => {
    expect(component['pet']).toBeDefined();
    expect(component['pet']()).toBeNull();
  });

  it('should have isLoading signal initialized', () => {
    expect(component['isLoading']).toBeDefined();
    expect(component['isLoading']()).toBe(false);
  });
});
