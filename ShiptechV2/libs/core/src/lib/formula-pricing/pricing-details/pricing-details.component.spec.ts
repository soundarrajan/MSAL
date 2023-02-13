import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { negoPricingDetailsComponent } from './pricing-details.component';

describe('negoPricingDetailsComponent', () => {
  let component: negoPricingDetailsComponent;
  let fixture: ComponentFixture<negoPricingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ negoPricingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(negoPricingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
