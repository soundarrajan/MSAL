import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowstatusOnchangeQuantityclaimPopupComponent } from './rowstatus-onchange-quantityclaim-popup.component';

describe('RowstatusOnchangeQuantityclaimPopupComponent', () => {
  let component: RowstatusOnchangeQuantityclaimPopupComponent;
  let fixture: ComponentFixture<RowstatusOnchangeQuantityclaimPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowstatusOnchangeQuantityclaimPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowstatusOnchangeQuantityclaimPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
