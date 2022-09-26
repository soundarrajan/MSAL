import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiptechContractNegotiationComponent } from './shiptech-contract-negotiation.component';

describe('ShiptechContractNegoComponent', () => {
  let component: ShiptechContractNegotiationComponent;
  let fixture: ComponentFixture<ShiptechContractNegotiationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiptechContractNegotiationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiptechContractNegotiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
