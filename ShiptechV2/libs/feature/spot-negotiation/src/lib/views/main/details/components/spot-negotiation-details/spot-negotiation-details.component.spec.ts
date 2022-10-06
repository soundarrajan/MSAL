import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotNegotiationDetailsComponent } from './spot-negotiation-details.component';

describe('SpotNegotiationDetailsComponent', () => {
  let component: SpotNegotiationDetailsComponent;
  let fixture: ComponentFixture<SpotNegotiationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotNegotiationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotNegotiationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
