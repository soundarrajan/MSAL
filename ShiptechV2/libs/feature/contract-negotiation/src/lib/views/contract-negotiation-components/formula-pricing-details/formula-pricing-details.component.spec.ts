import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaPricingDetailsComponent } from './formula-pricing-details.component';

describe('FormulaPricingDetailsComponent', () => {
  let component: FormulaPricingDetailsComponent;
  let fixture: ComponentFixture<FormulaPricingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaPricingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaPricingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
