import { TestBed } from '@angular/core/testing';

import { Pqrs } from './pqrs';

describe('Pqrs', () => {
  let service: Pqrs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pqrs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
