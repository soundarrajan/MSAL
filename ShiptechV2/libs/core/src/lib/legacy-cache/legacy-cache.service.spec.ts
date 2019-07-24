import { TestBed } from '@angular/core/testing';

import { LegacyCacheService } from './legacy-cache.service';

describe('LegacyCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LegacyCacheService = TestBed.get(LegacyCacheService);
    expect(service).toBeTruthy();
  });
});
