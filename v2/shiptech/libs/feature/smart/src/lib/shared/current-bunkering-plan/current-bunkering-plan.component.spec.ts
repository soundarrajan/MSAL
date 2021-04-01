import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentBunkeringPlanComponent } from './current-bunkering-plan.component';

describe('CurrentBunkeringPlanComponent', () => {
  let component: CurrentBunkeringPlanComponent;
  let fixture: ComponentFixture<CurrentBunkeringPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentBunkeringPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentBunkeringPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
