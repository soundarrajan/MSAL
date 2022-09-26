import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractNegoEmaillogComponent } from './contract-nego-emaillog.component';

describe('ContractNegoEmaillogComponent', () => {
  let component: ContractNegoEmaillogComponent;
  let fixture: ComponentFixture<ContractNegoEmaillogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractNegoEmaillogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractNegoEmaillogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
