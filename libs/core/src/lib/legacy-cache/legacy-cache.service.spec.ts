import { TestBed } from '@angular/core/testing';

import { LookupsCacheService } from './legacy-cache.service';

describe('LegacyCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LookupsCacheService = TestBed.get(LookupsCacheService);
    expect(service).toBeTruthy();
  });
});
