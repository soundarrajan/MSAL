import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselArrivalsComponent } from './vessel-arrivals.component';

describe('VesselArrivalsComponent', () => {
  let component: VesselArrivalsComponent;
  let fixture: ComponentFixture<VesselArrivalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VesselArrivalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselArrivalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
