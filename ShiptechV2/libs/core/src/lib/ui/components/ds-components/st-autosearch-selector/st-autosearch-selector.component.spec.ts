import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StAutosearchSelectorComponent } from './st-autosearch-selector.component';

describe('StAutosearchSelectorComponent', () => {
  let component: StAutosearchSelectorComponent;
  let fixture: ComponentFixture<StAutosearchSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StAutosearchSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StAutosearchSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
