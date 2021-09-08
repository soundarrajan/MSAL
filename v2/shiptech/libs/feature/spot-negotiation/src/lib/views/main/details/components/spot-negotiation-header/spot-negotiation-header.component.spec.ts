import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotNegotiationHeaderComponent } from './spot-negotiation-header.component';

describe('SpotNegotiationHeaderComponent', () => {
  let component: SpotNegotiationHeaderComponent;
  let fixture: ComponentFixture<SpotNegotiationHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpotNegotiationHeaderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotNegotiationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
