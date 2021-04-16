import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousBunkeringPlanComponent } from './previous-bunkering-plan.component';

describe('PreviousBunkeringPlanComponent', () => {
  let component: PreviousBunkeringPlanComponent;
  let fixture: ComponentFixture<PreviousBunkeringPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousBunkeringPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousBunkeringPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
