import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresetsMenuDropdownComponent } from './presets-menu-dropdown.component';

describe('PresetsMenuDropdownComponent', () => {
  let component: PresetsMenuDropdownComponent;
  let fixture: ComponentFixture<PresetsMenuDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresetsMenuDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresetsMenuDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
