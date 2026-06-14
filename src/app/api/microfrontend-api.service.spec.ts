import { TestBed } from '@angular/core/testing';

import { MicrofrontendApiService } from './microfrontend-api.service';

describe('MicrofrontendApiService', () => {
  let service: MicrofrontendApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MicrofrontendApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
