import { TestBed } from '@angular/core/testing';

import { AccountHeadService } from './account-head.service';

describe('AccountHeadService', () => {
  let service: AccountHeadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountHeadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
