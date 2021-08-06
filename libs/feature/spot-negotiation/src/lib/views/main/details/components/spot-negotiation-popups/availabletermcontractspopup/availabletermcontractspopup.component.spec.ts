import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabletermcontractspopupComponent } from './availabletermcontractspopup.component';

describe('AvailabletermcontractspopupComponent', () => {
  let component: AvailabletermcontractspopupComponent;
  let fixture: ComponentFixture<AvailabletermcontractspopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailabletermcontractspopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabletermcontractspopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
