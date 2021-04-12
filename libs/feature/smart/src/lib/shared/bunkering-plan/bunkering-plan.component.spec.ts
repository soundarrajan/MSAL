import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BunkeringPlanComponent } from './bunkering-plan.component';

describe('BunkeringPlanComponent', () => {
  let component: BunkeringPlanComponent;
  let fixture: ComponentFixture<BunkeringPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BunkeringPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BunkeringPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
