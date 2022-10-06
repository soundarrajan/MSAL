import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselPopupComponent } from './vessel-popup.component';

describe('VesselPopupComponent', () => {
  let component: VesselPopupComponent;
  let fixture: ComponentFixture<VesselPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VesselPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
