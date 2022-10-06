import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotnegoPricingDetailsComponent } from './spotnego-pricing-details.component';

describe('SpotnegoPricingDetailsComponent', () => {
  let component: SpotnegoPricingDetailsComponent;
  let fixture: ComponentFixture<SpotnegoPricingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotnegoPricingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotnegoPricingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
