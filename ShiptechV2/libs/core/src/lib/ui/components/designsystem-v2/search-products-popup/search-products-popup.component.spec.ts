import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProductsPopupComponent } from './search-products-popup.component';

describe('SearchProductsPopupComponent', () => {
  let component: SearchProductsPopupComponent;
  let fixture: ComponentFixture<SearchProductsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchProductsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchProductsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
