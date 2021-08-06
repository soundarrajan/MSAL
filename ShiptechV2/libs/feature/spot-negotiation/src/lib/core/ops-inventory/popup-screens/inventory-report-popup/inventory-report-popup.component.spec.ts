import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReportPopupComponent } from './inventory-report-popup.component';

describe('InventoryReportPopupComponent', () => {
  let component: InventoryReportPopupComponent;
  let fixture: ComponentFixture<InventoryReportPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryReportPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryReportPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
