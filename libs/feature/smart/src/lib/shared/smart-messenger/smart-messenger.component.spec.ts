import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartMessengerComponent } from './smart-messenger.component';

describe('SmartMessengerComponent', () => {
  let component: SmartMessengerComponent;
  let fixture: ComponentFixture<SmartMessengerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartMessengerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartMessengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
