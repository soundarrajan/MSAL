import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowstatusOnchangeResiduePopupComponent } from './rowstatus-onchange-residue-popup.component';

describe('RowstatusOnchangeResiduePopupComponent', () => {
  let component: RowstatusOnchangeResiduePopupComponent;
  let fixture: ComponentFixture<RowstatusOnchangeResiduePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowstatusOnchangeResiduePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowstatusOnchangeResiduePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
