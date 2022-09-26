import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalCostPopupComponent } from './additional-cost-popup.component';

describe('AdditionalCostPopupComponent', () => {
  let component: AdditionalCostPopupComponent;
  let fixture: ComponentFixture<AdditionalCostPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalCostPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalCostPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
