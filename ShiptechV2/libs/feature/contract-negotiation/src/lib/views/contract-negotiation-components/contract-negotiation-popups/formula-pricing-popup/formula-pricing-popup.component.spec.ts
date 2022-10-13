import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaPricingPopupComponent } from './formula-pricing-popup.component';

describe('FormulaPricingPopupComponent', () => {
  let component: FormulaPricingPopupComponent;
  let fixture: ComponentFixture<FormulaPricingPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaPricingPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaPricingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
