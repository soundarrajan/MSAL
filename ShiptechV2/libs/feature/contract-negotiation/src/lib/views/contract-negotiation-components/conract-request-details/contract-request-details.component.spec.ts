import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractRequestDetailsComponent } from './contract-request-details.component';

describe('ContractRequestDetailsComponent', () => {
  let component: ContractRequestDetailsComponent;
  let fixture: ComponentFixture<ContractRequestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractRequestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
