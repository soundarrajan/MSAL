import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractNegoAuditlogComponent } from './contract-nego-auditlog.component';

describe('ContractNegoAuditlogComponent', () => {
  let component: ContractNegoAuditlogComponent;
  let fixture: ComponentFixture<ContractNegoAuditlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractNegoAuditlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractNegoAuditlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
