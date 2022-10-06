import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedInvoiceComponent } from './related-invoice.component';

describe('RelatedInvoiceComponent', () => {
  let component: RelatedInvoiceComponent;
  let fixture: ComponentFixture<RelatedInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
