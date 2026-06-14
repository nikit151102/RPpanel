import { TestBed } from '@angular/core/testing';

import { QrClientService } from './qr-client.service';

describe('QrClientService', () => {
  let service: QrClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
