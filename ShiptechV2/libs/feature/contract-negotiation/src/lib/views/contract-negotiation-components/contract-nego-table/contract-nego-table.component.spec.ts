import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractNegoTableComponent } from './contract-nego-table.component';

describe('ContractNegoTableComponent', () => {
  let component: ContractNegoTableComponent;
  let fixture: ComponentFixture<ContractNegoTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractNegoTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractNegoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
