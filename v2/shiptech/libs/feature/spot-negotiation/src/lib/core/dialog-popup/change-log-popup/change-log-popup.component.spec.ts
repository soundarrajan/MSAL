import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLogPopupComponent } from './change-log-popup.component';

describe('ChangeLogPopupComponent', () => {
  let component: ChangeLogPopupComponent;
  let fixture: ComponentFixture<ChangeLogPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeLogPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLogPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
