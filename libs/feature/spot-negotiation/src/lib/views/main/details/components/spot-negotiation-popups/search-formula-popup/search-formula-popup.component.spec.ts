import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormulaPopupComponent } from './search-formula-popup.component';

describe('SearchFormulaPopupComponent', () => {
  let component: SearchFormulaPopupComponent;
  let fixture: ComponentFixture<SearchFormulaPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFormulaPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormulaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
