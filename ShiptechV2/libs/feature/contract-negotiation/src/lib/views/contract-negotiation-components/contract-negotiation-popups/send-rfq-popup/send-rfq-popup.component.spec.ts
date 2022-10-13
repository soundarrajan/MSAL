import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendRfqPopupComponent } from './send-rfq-popup.component';

describe('SendRfqPopupComponent', () => {
  let component: SendRfqPopupComponent;
  let fixture: ComponentFixture<SendRfqPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendRfqPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendRfqPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
