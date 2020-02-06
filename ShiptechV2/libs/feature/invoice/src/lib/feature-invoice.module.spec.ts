import { async, TestBed } from '@angular/core/testing';
import { FeatureInvoiceModule } from './feature-invoice.module';

describe('FeatureInvoiceModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FeatureInvoiceModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(FeatureInvoiceModule).toBeDefined();
  });
});
