import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NegotiationReportComponent } from './negotiation-report.component';

describe('NegotiationReportComponent', () => {
  let component: NegotiationReportComponent;
  let fixture: ComponentFixture<NegotiationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NegotiationReportComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegotiationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
