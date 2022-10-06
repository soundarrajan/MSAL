import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketpricehistorypopupComponent } from './marketpricehistorypopup.component';

describe('MarketpricehistorypopupComponent', () => {
  let component: MarketpricehistorypopupComponent;
  let fixture: ComponentFixture<MarketpricehistorypopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketpricehistorypopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketpricehistorypopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
