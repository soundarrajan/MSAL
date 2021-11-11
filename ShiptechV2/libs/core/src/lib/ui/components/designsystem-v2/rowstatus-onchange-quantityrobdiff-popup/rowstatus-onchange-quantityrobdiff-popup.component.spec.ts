import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowstatusOnchangeQuantityrobdiffPopupComponent } from './rowstatus-onchange-quantityrobdiff-popup.component';

describe('RowstatusOnchangeQuantityrobdiffPopupComponent', () => {
  let component: RowstatusOnchangeQuantityrobdiffPopupComponent;
  let fixture: ComponentFixture<RowstatusOnchangeQuantityrobdiffPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowstatusOnchangeQuantityrobdiffPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowstatusOnchangeQuantityrobdiffPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
