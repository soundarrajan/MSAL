import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractNegotiationHeaderComponent } from './contract-negotiation-header.component';

describe('ContractNegotiationHeaderComponent', () => {
  let component: ContractNegotiationHeaderComponent;
  let fixture: ComponentFixture<ContractNegotiationHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractNegotiationHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractNegotiationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
