import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotNegotiationNewCommentsComponent } from './spot-negotiation-new-comments.component';

describe('SpotNegotiationNewCommentsComponent', () => {
  let component: SpotNegotiationNewCommentsComponent;
  let fixture: ComponentFixture<SpotNegotiationNewCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotNegotiationNewCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotNegotiationNewCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
