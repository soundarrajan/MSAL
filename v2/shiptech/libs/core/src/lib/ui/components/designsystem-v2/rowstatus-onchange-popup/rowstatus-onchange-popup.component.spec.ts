import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowstatusOnchangePopupComponent } from './rowstatus-onchange-popup.component';

describe('RowstatusOnchangePopupComponent', () => {
  let component: RowstatusOnchangePopupComponent;
  let fixture: ComponentFixture<RowstatusOnchangePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowstatusOnchangePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowstatusOnchangePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
