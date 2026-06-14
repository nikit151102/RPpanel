import { TestBed } from '@angular/core/testing';

import { MicrofrontendsService } from './microfrontends.service';

describe('MicrofrontendsService', () => {
  let service: MicrofrontendsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MicrofrontendsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
