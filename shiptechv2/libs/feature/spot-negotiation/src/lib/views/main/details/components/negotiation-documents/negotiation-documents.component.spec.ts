import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NegotiationComponent } from './negotiation-documents.component';

describe('NegotiationComponent', () => {
  let component: NegotiationComponent;
  let fixture: ComponentFixture<NegotiationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NegotiationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegotiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
