import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterchipsComponent } from './filterchips.component';

describe('FilterchipsComponent', () => {
  let component: FilterchipsComponent;
  let fixture: ComponentFixture<FilterchipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterchipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterchipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
