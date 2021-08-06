import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationSummaryWithStatusComponent } from './operation-summary-with-status.component';

describe('OperationSummaryWithStatusComponent', () => {
  let component: OperationSummaryWithStatusComponent;
  let fixture: ComponentFixture<OperationSummaryWithStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationSummaryWithStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationSummaryWithStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
