import { TestBed } from '@angular/core/testing';

import { FdsnService } from './fdsn.service';

describe('FdsnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FdsnService = TestBed.get(FdsnService);
    expect(service).toBeTruthy();
  });
});
