import { async, TestBed } from '@angular/core/testing';
import { InvoiceModule } from './invoice.module';

describe('InvoiceModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [InvoiceModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(InvoiceModule).toBeDefined();
  });
});
