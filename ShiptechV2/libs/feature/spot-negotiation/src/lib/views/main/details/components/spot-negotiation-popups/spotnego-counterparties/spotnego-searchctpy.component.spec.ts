import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotnegoSearchCtpyComponent } from './spotnego-searchctpy.component';

describe('SpotnegoSearchCtpyComponent', () => {
  let component: SpotnegoSearchCtpyComponent;
  let fixture: ComponentFixture<SpotnegoSearchCtpyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotnegoSearchCtpyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotnegoSearchCtpyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
