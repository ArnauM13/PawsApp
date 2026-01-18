import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { DataViewComponent } from './dataview.component';

interface TestItem {
  id: number;
  name: string;
}

describe('DataViewComponent', () => {
  let component: DataViewComponent<TestItem>;
  let fixture: ComponentFixture<DataViewComponent<TestItem>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataViewComponent, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DataViewComponent<TestItem>);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default layout to grid', () => {
    expect(component.layout()).toBe('grid');
  });

  it('should set default rows to 6', () => {
    expect(component.rows()).toBe(6);
  });
});
