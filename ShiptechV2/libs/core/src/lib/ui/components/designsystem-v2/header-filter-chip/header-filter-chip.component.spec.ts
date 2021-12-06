import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderFilterChipComponent } from './header-filter-chip.component';

describe('HeaderFilterChipComponent', () => {
  let component: HeaderFilterChipComponent;
  let fixture: ComponentFixture<HeaderFilterChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderFilterChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderFilterChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
