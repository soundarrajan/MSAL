import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractNegoGridComponent } from './contract-nego-grid.component';

describe('ContractNegoGridComponent', () => {
  let component: ContractNegoGridComponent;
  let fixture: ComponentFixture<ContractNegoGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractNegoGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractNegoGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
