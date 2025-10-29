import { TestBed } from '@angular/core/testing';

import { AlcoholicService } from './alcoholic.service';

describe('AlcoholicService', () => {
  let service: AlcoholicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlcoholicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
