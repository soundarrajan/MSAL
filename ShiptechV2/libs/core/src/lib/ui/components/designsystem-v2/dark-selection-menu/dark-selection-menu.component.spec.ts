import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkSelectionMenuComponent } from './dark-selection-menu.component';

describe('DarkSelectionMenuComponent', () => {
  let component: DarkSelectionMenuComponent;
  let fixture: ComponentFixture<DarkSelectionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DarkSelectionMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DarkSelectionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
