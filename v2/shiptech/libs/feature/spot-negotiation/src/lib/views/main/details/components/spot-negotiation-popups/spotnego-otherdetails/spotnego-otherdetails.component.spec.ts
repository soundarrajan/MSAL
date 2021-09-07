import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotnegoOtherdetailsComponent } from './spotnego-otherdetails.component';

describe('SpotnegoOtherdetailsComponent', () => {
  let component: SpotnegoOtherdetailsComponent;
  let fixture: ComponentFixture<SpotnegoOtherdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotnegoOtherdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotnegoOtherdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
