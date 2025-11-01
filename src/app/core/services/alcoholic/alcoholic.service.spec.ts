
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AlcoholicService } from './alcoholic.service';
import { environment } from '../../../../environments/environment';

describe('AlcoholicService', () => {
  let service: AlcoholicService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AlcoholicService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve the list of alcoholic drinks', async () => {
    const mockResponse = { drinks: [{ strAlcoholic: 'Alcoholic' }] };
    const promise = service.listAlcoholic();

    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/list.php?a=list`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    const result = await promise;
    expect(result).toEqual(mockResponse);
  });
});

