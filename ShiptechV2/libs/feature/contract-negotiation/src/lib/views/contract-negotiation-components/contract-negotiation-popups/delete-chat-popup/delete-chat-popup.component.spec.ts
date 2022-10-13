import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteChatPopupComponent } from './delete-chat-popup.component';

describe('DeleteChatPopupComponent', () => {
  let component: DeleteChatPopupComponent;
  let fixture: ComponentFixture<DeleteChatPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteChatPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteChatPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
