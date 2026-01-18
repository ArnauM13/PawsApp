import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageDropdownComponent } from './language-dropdown.component';

describe('LanguageDropdownComponent', () => {
  let component: LanguageDropdownComponent;
  let fixture: ComponentFixture<LanguageDropdownComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageDropdownComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageDropdownComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have three language options', () => {
    expect(component.languages.length).toBe(3);
    expect(component.languages).toContainEqual({ label: 'English', value: 'en' });
    expect(component.languages).toContainEqual({ label: 'Español', value: 'es' });
    expect(component.languages).toContainEqual({ label: 'Català', value: 'ca' });
  });

  it('should change language when changeLang is called', () => {
    const useSpy = vi.spyOn(translateService, 'use');

    component.changeLang('ca');
    fixture.detectChanges();

    expect(component.currentLang).toBe('ca');
    expect(useSpy).toHaveBeenCalledWith('ca');
  });
});
