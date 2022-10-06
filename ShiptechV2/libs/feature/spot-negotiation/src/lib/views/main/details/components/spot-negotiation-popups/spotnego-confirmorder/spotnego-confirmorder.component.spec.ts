import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotnegoConfirmorderComponent } from './spotnego-confirmorder.component';

describe('SpotnegoConfirmorderComponent', () => {
  let component: SpotnegoConfirmorderComponent;
  let fixture: ComponentFixture<SpotnegoConfirmorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotnegoConfirmorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotnegoConfirmorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
