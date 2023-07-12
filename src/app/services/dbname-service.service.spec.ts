import { TestBed } from '@angular/core/testing';

import { DbnameServiceService } from './dbname-service.service';

describe('DbnameServiceService', () => {
  let service: DbnameServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbnameServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
