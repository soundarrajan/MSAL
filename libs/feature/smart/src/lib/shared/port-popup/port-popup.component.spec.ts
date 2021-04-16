import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortPopupComponent } from './port-popup.component';

describe('PortPopupComponent', () => {
  let component: PortPopupComponent;
  let fixture: ComponentFixture<PortPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
