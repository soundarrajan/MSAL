import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchVesselComponent } from './search-vessel.component';

describe('SearchVesselComponent', () => {
  let component: SearchVesselComponent;
  let fixture: ComponentFixture<SearchVesselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchVesselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchVesselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
