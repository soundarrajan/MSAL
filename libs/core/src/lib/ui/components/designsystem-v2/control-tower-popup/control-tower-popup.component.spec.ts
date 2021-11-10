import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlTowerPopupComponent } from './control-tower-popup.component';

describe('ControlTowerPopupComponent', () => {
  let component: ControlTowerPopupComponent;
  let fixture: ComponentFixture<ControlTowerPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlTowerPopupComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlTowerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
