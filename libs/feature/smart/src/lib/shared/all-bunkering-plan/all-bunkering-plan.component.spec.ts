import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBunkeringPlanComponent } from './all-bunkering-plan.component';

describe('BunkeringPlanComponent', () => {
  let component: AllBunkeringPlanComponent;
  let fixture: ComponentFixture<AllBunkeringPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllBunkeringPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBunkeringPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
