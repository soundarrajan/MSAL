import { async, TestBed } from '@angular/core/testing';
import { FeatureQualityControlModule } from './feature-quality-control.module';

describe('FeatureQualityControlModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FeatureQualityControlModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(FeatureQualityControlModule).toBeDefined();
  });
});
