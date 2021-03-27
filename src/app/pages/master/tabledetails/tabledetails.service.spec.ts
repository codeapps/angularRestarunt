import { TestBed } from '@angular/core/testing';

import { TabledetailsService } from './tabledetails.service';

describe('TabledetailsService', () => {
  let service: TabledetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabledetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
