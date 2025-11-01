
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IngredientService } from './ingredient.service';
import { environment } from '../../../../environments/environment';
import { IngredientListModel } from '../../models/ingredient.model';

describe('IngredientService', () => {
  let service: IngredientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(IngredientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list ingredients', async () => {
    const mockResponse = { drinks: [{ strIngredient1: 'Vodka' }] };
    const promise = service.listIngredients();
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/list.php?i=list`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('should list ingredients observable', () => {
    const mockResponse: IngredientListModel = { drinks: [{ strIngredient1: 'Vodka' }] };
    service.listIngredientsObservable().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/list.php?i=list`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should search ingredient by name', async () => {
    const mockResponse = { ingredients: [{ idIngredient: '1', strIngredient: 'Vodka' }] };
    const promise = service.searchIngredientByName('vodka');
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/search.php?i=vodka`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('should lookup ingredient by ID', async () => {
    const mockResponse = { ingredients: [{ idIngredient: '1', strIngredient: 'Vodka' }] };
    const promise = service.lookupIngredientById('1');
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/lookup.php?iid=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });
});
