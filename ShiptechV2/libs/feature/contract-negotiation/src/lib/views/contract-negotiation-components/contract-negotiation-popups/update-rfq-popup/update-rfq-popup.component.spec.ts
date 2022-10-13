import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRfqPopupComponent } from './update-rfq-popup.component';

describe('UpdateRfqPopupComponent', () => {
  let component: UpdateRfqPopupComponent;
  let fixture: ComponentFixture<UpdateRfqPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRfqPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRfqPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
