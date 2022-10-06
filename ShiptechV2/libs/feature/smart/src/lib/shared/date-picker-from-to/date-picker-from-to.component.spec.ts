import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerFromToComponent } from './date-picker-from-to.component';

describe('DatePickerFromToComponent', () => {
  let component: DatePickerFromToComponent;
  let fixture: ComponentFixture<DatePickerFromToComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatePickerFromToComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerFromToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
