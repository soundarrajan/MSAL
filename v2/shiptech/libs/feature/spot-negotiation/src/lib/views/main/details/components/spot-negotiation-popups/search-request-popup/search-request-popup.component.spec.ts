import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRequestPopupComponent } from './search-request-popup.component';

describe('SearchRequestPopupComponent', () => {
  let component: SearchRequestPopupComponent;
  let fixture: ComponentFixture<SearchRequestPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchRequestPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRequestPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
