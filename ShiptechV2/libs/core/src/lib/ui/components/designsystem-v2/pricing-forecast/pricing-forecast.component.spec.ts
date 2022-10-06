import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingForecastComponent } from './pricing-forecast.component';

describe('PricingForecastComponent', () => {
  let component: PricingForecastComponent;
  let fixture: ComponentFixture<PricingForecastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingForecastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
