import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLocationPopupComponent } from './search-location-popup.component';

describe('SearchLocationPopupComponent', () => {
  let component: SearchLocationPopupComponent;
  let fixture: ComponentFixture<SearchLocationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchLocationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLocationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
