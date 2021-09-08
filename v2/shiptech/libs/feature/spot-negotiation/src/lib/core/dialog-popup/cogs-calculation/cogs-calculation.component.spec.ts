import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CogsCalculationComponent } from './cogs-calculation.component';

describe('CogsCalculationComponent', () => {
  let component: CogsCalculationComponent;
  let fixture: ComponentFixture<CogsCalculationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CogsCalculationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CogsCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
