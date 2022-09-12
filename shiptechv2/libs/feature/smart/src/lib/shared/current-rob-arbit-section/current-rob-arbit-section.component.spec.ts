import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentRobArbitSectionComponent } from './current-rob-arbit-section.component';

describe('CurrentRobArbitSectionComponent', () => {
  let component: CurrentRobArbitSectionComponent;
  let fixture: ComponentFixture<CurrentRobArbitSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentRobArbitSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentRobArbitSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
