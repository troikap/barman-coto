
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GlassService } from './glass.service';
import { environment } from '../../../../environments/environment';

describe('GlassService', () => {
  let service: GlassService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(GlassService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve the list of glasses', async () => {
    const mockResponse = { drinks: [{ strGlass: 'Highball glass' }] };
    const promise = service.listGlasses();

    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/list.php?g=list`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    const result = await promise;
    expect(result).toEqual(mockResponse);
  });
});

