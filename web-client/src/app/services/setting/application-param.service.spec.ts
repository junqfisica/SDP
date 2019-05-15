import { TestBed } from '@angular/core/testing';

import { ApplicationParamService } from './application-param.service';

describe('ApplicationParamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicationParamService = TestBed.get(ApplicationParamService);
    expect(service).toBeTruthy();
  });
});
