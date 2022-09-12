import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotnegoOtherdetails2Component } from './spotnego-otherdetails2.component';

describe('SpotnegoOtherdetails2Component', () => {
  let component: SpotnegoOtherdetails2Component;
  let fixture: ComponentFixture<SpotnegoOtherdetails2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotnegoOtherdetails2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotnegoOtherdetails2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
