import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotnegoOfferpricehistoryComponent } from './spotnego-offerpricehistory.component';

describe('SpotnegoOfferpricehistoryComponent', () => {
  let component: SpotnegoOfferpricehistoryComponent;
  let fixture: ComponentFixture<SpotnegoOfferpricehistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotnegoOfferpricehistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotnegoOfferpricehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
