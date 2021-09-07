import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationSummaryWithoutaddnewComponent } from './operation-summary-withoutaddnew.component';

describe('OperationSummaryWithoutaddnewComponent', () => {
  let component: OperationSummaryWithoutaddnewComponent;
  let fixture: ComponentFixture<OperationSummaryWithoutaddnewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationSummaryWithoutaddnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationSummaryWithoutaddnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
