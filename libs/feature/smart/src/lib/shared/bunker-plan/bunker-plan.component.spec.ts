import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BunkerPlanComponent } from './bunker-plan.component';

describe('BunkerPlanComponent', () => {
  let component: BunkerPlanComponent;
  let fixture: ComponentFixture<BunkerPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BunkerPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BunkerPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
