import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceTypeSelectionComponent } from './invoice-type-selection.component';

describe('InvoiceTypeSelectionComponent', () => {
  let component: InvoiceTypeSelectionComponent;
  let fixture: ComponentFixture<InvoiceTypeSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceTypeSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceTypeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
