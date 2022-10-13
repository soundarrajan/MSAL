import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContractRequestPopupComponent } from './create-contract-request-popup.component';

describe('CreateContractRequestPopupComponent', () => {
  let component: CreateContractRequestPopupComponent;
  let fixture: ComponentFixture<CreateContractRequestPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateContractRequestPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContractRequestPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
