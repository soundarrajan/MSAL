import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableFiltersPreferencesComponent } from './available-filters-preferences.component';

describe('AvailableFiltersPreferencesComponent', () => {
  let component: AvailableFiltersPreferencesComponent;
  let fixture: ComponentFixture<AvailableFiltersPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableFiltersPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableFiltersPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
