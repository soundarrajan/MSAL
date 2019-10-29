import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcReportsListComponent } from './qc-reports-list.component';

describe('PortCallsListComponent', () => {
  let component: QcReportsListComponent;
  let fixture: ComponentFixture<QcReportsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QcReportsListComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcReportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
