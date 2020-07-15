import { async, TestBed } from '@angular/core/testing';
import { EteModule } from './ete.module';

describe('EteModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EteModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EteModule).toBeDefined();
  });
});
