import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningDeletePopupComponent } from './warning-delete-popup.component';

describe('WarningDeletePopupComponent', () => {
  let component: WarningDeletePopupComponent;
  let fixture: ComponentFixture<WarningDeletePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningDeletePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
