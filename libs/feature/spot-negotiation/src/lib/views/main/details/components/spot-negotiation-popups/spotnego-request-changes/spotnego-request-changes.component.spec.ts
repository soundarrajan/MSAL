import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotnegoRequestChangesComponent } from './spotnego-request-changes.component';

describe('SpotnegoRequestChangesComponent', () => {
  let component: SpotnegoRequestChangesComponent;
  let fixture: ComponentFixture<SpotnegoRequestChangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotnegoRequestChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotnegoRequestChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
