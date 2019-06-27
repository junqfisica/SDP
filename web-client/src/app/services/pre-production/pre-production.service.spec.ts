import { TestBed } from '@angular/core/testing';

import { PreProductionService } from './pre-production.service';

describe('PreProductionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreProductionService = TestBed.get(PreProductionService);
    expect(service).toBeTruthy();
  });
});
