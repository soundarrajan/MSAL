import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationSummaryPopComponent } from './operation-summary-pop.component';

describe('OperationSummaryPopComponent', () => {
  let component: OperationSummaryPopComponent;
  let fixture: ComponentFixture<OperationSummaryPopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationSummaryPopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationSummaryPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
