import { TestBed } from '@angular/core/testing';

import { SettingsService } from './application-param.service';

describe('ApplicationParamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsService = TestBed.get(SettingsService);
    expect(service).toBeTruthy();
  });
});
