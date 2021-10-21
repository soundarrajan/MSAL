import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartFilterComponent } from './smart-filter.component';

describe('SmartFilterComponent', () => {
  let component: SmartFilterComponent;
  let fixture: ComponentFixture<SmartFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
