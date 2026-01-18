import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let mockContentTemplate: TemplateRef<any>;

  beforeEach(async () => {
    mockContentTemplate = {
      elementRef: { nativeElement: document.createElement('div') },
      createEmbeddedViewImpl: vi.fn(() => ({
        rootNodes: [],
        context: {},
        destroy: vi.fn()
      }))
    } as any as TemplateRef<any>;

    await TestBed.configureTestingModule({
      imports: [CardComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept contentTemplate as required input', () => {
    component.contentTemplate = mockContentTemplate;
    expect(component.contentTemplate).toBe(mockContentTemplate);
  });

  it('should accept optional style input', () => {
    component.contentTemplate = mockContentTemplate;
    const customStyle = { width: '100%', height: '200px' };
    fixture.componentRef.setInput('style', customStyle);
    expect(component.style()).toEqual(customStyle);
  });
});
