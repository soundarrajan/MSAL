import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotNegotiationCommentsComponent } from './spot-negotiation-comments.component';

describe('SpotNegotiationCommentsComponent', () => {
  let component: SpotNegotiationCommentsComponent;
  let fixture: ComponentFixture<SpotNegotiationCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotNegotiationCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotNegotiationCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
