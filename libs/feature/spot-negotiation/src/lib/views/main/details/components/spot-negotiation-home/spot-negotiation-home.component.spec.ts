import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotNegotiationHomeComponent } from './spot-negotiation-home.component';

describe('SpotNegotiationHomeComponent', () => {
  let component: SpotNegotiationHomeComponent;
  let fixture: ComponentFixture<SpotNegotiationHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpotNegotiationHomeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotNegotiationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
