
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ImageService } from './image.service';
import { environment } from '../../../../environments/environment';

describe('ImageService', () => {
  let service: ImageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ImageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get drink image with small size', async () => {
    const mockResponse = 'mockImage';
    const promise = service.getDrinkImage('margarita', 'small');
    const req = httpMock.expectOne(`${environment.apiUrl}/images/media/drink/margarita.jpg/small`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('should get drink image with medium size', async () => {
    const mockResponse = 'mockImage';
    const promise = service.getDrinkImage('margarita', 'medium');
    const req = httpMock.expectOne(`${environment.apiUrl}/images/media/drink/margarita.jpg/medium`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('should get drink image with large size', async () => {
    const mockResponse = 'mockImage';
    const promise = service.getDrinkImage('margarita', 'large');
    const req = httpMock.expectOne(`${environment.apiUrl}/images/media/drink/margarita.jpg/large`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('should get ingredient image with small size', async () => {
    const mockResponse = 'mockImage';
    const promise = service.getIngredientImage('lemon', 'small');
    const req = httpMock.expectOne(`${environment.apiUrl}/images/ingredients/lemon-small.png`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('should get ingredient image with medium size', async () => {
    const mockResponse = 'mockImage';
    const promise = service.getIngredientImage('lemon', 'medium');
    const req = httpMock.expectOne(`${environment.apiUrl}/images/ingredients/lemon-medium.png`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('should get ingredient image with null size', async () => {
    const mockResponse = 'mockImage';
    const promise = service.getIngredientImage('lemon', null);
    const req = httpMock.expectOne(`${environment.apiUrl}/images/ingredients/lemon.png`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });
});
