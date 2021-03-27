import { TestBed } from '@angular/core/testing';

import { AddtableService } from './addtable.service';

describe('AddtableService', () => {
  let service: AddtableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddtableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
