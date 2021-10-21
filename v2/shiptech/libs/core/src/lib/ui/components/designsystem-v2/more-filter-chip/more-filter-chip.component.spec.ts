import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreFilterChipComponent } from './more-filter-chip.component';

describe('MoreFilterChipComponent', () => {
  let component: MoreFilterChipComponent;
  let fixture: ComponentFixture<MoreFilterChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreFilterChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreFilterChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
