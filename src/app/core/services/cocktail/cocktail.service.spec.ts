
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CocktailService } from './cocktail.service';
import { environment } from '../../../../environments/environment';
import { DrinksModel } from '../../models/cocktail.model';

describe('CocktailService', () => {
  let service: CocktailService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CocktailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search cocktail by name', async () => {
    const mockResponse: DrinksModel = { drinks: [] };
    const promise = service.searchCocktailByName('margarita');
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/search.php?s=margarita`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('should search cocktails by name observable', () => {
    const mockResponse: DrinksModel = { drinks: [] };
    service.searchCocktailsByNameObservable('margarita').subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/search.php?s=margarita`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle "no data found" for search by name', () => {
    const mockResponse = { drinks: 'no data found' };
    service.searchCocktailsByNameObservable('margarita').subscribe(result => {
      expect(result.drinks).toBeNull();
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/search.php?s=margarita`);
    req.flush(mockResponse);
  });

  it('should list cocktails by first letter', async () => {
    const mockResponse: DrinksModel = { drinks: [] };
    const promise = service.listCocktailsByFirstLetter('a');
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/search.php?f=a`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('should lookup cocktail by id', async () => {
    const mockResponse: DrinksModel = { drinks: [] };
    const promise = service.lookupCocktailById('11007');
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/lookup.php?i=11007`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('should lookup cocktail by id observable', () => {
    const mockResponse: DrinksModel = { drinks: [] };
    service.lookupCocktailByIdObservable('11007').subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/lookup.php?i=11007`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle "no data found" for lookup by id', () => {
    const mockResponse = { drinks: 'no data found' };
    service.lookupCocktailByIdObservable('11007').subscribe(result => {
      expect(result.drinks).toBeNull();
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/lookup.php?i=11007`);
    req.flush(mockResponse);
  });

  it('should lookup random cocktail', async () => {
    const mockResponse: DrinksModel = { drinks: [] };
    const promise = service.lookupCocktailRandom();
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/random.php`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('should search cocktail by ingredient', async () => {
    const mockResponse: DrinksModel = { drinks: [] };
    const promise = service.searchCocktailByIngredient('vodka');
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/filter.php?i=vodka`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('should search cocktails by ingredient observable', () => {
    const mockResponse: DrinksModel = { drinks: [] };
    service.searchCocktailsByIngredientObservable('vodka').subscribe(result => {
      expect(result).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/filter.php?i=vodka`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle "no data found" for search by ingredient', () => {
    const mockResponse = { drinks: 'no data found' };
    service.searchCocktailsByIngredientObservable('vodka').subscribe(result => {
      expect(result.drinks).toBeNull();
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/filter.php?i=vodka`);
    req.flush(mockResponse);
  });

  it('should search cocktail by alcoholic', async () => {
    const mockResponse: DrinksModel = { drinks: [] };
    const promise = service.searchCocktailByAlcoholic('Alcoholic');
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/filter.php?a=Alcoholic`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('should search cocktail by category', async () => {
    const mockResponse: DrinksModel = { drinks: [] };
    const promise = service.searchCocktailByCategory('Ordinary_Drink');
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/filter.php?c=Ordinary_Drink`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('should search cocktail by glass', async () => {
    const mockResponse: DrinksModel = { drinks: [] };
    const promise = service.searchCocktailByGlass('Cocktail_glass');
    const req = httpMock.expectOne(`${environment.apiUrl}/${environment.versionUrl}/filter.php?g=Cocktail_glass`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });
});
