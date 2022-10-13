import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyOfferPeriodPopupComponent } from './modify-offer-period-popup.component';

describe('ModifyOfferPeriodPopupComponent', () => {
  let component: ModifyOfferPeriodPopupComponent;
  let fixture: ComponentFixture<ModifyOfferPeriodPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyOfferPeriodPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyOfferPeriodPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
