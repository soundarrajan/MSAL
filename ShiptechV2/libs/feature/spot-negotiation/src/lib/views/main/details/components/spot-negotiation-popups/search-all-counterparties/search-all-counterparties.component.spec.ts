import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAllCounterpartiesComponent } from './search-all-counterparties.component';

describe('SearchAllCounterpartiesComponent', () => {
  let component: SearchAllCounterpartiesComponent;
  let fixture: ComponentFixture<SearchAllCounterpartiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAllCounterpartiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAllCounterpartiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
