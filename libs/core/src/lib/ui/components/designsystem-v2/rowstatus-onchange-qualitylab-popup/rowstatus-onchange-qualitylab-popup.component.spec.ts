import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowstatusOnchangeQualitylabPopupComponent } from './rowstatus-onchange-qualitylab-popup.component';

describe('RowstatusOnchangeQualitylabPopupComponent', () => {
  let component: RowstatusOnchangeQualitylabPopupComponent;
  let fixture: ComponentFixture<RowstatusOnchangeQualitylabPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowstatusOnchangeQualitylabPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowstatusOnchangeQualitylabPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
