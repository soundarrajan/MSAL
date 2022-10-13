import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractNegotiationDetailsComponent } from './contract-negotiation-details.component';

describe('ContractNegotiationDetailsComponent', () => {
  let component: ContractNegotiationDetailsComponent;
  let fixture: ComponentFixture<ContractNegotiationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractNegotiationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractNegotiationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
