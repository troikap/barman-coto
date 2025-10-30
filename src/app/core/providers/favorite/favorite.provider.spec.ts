import { TestBed } from '@angular/core/testing';

import { FavoritesProvider } from './favorite.provider';

describe('FavoritesProvider', () => {
  let service: FavoritesProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
