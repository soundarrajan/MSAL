import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyReportHistoryComponent } from './survey-report-history.component';

describe('SurveyReportHistoryComponent', () => {
  let component: SurveyReportHistoryComponent;
  let fixture: ComponentFixture<SurveyReportHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyReportHistoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyReportHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
