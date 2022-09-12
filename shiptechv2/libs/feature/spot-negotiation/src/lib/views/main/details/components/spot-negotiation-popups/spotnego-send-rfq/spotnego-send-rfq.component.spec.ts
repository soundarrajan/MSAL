import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotnegoSendRfqComponent } from './spotnego-send-rfq.component';

describe('SpotnegoSendRfqComponent', () => {
  let component: SpotnegoSendRfqComponent;
  let fixture: ComponentFixture<SpotnegoSendRfqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotnegoSendRfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotnegoSendRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
