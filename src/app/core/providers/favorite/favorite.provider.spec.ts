
import { TestBed } from '@angular/core/testing';
import { FavoritesProvider } from './favorite.provider';
import { StorageProvider } from '../storage/storage.provider';
import { CocktailModel } from '../../models/cocktail.model';

describe('FavoritesProvider', () => {
  let service: FavoritesProvider;
  let storageProviderSpy: jasmine.SpyObj<StorageProvider>;
  let addEventListenerSpy: jasmine.Spy;

  const mockCocktail: Partial<CocktailModel> = {
    idDrink: '1',
    strDrink: 'Margarita',
    strDrinkThumb: 'margarita.jpg',
  };

  const mockCocktail2: Partial<CocktailModel> = {
    idDrink: '2',
    strDrink: 'Mojito',
    strDrinkThumb: 'mojito.jpg',
  };

  beforeEach(() => {
    storageProviderSpy = jasmine.createSpyObj('StorageProvider', ['getItem', 'setItem']);
    storageProviderSpy.getItem.and.returnValue(null);

    TestBed.configureTestingModule({
      providers: [
        FavoritesProvider,
        { provide: StorageProvider, useValue: storageProviderSpy },
      ],
    });
    service = TestBed.inject(FavoritesProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    beforeEach(() => {
      addEventListenerSpy = spyOn(window, 'addEventListener').and.callThrough();
    });

    it('should load favorites from storage if available', () => {
      TestBed.resetTestingModule();
      storageProviderSpy = jasmine.createSpyObj('StorageProvider', ['getItem', 'setItem']);
      storageProviderSpy.getItem.and.returnValue([mockCocktail as CocktailModel]);
      TestBed.configureTestingModule({
        providers: [
          FavoritesProvider,
          { provide: StorageProvider, useValue: storageProviderSpy },
        ],
      });
      service = TestBed.inject(FavoritesProvider);
      expect(service.isFavorite(mockCocktail as CocktailModel)).toBeTrue();
    });

    it('should handle storage event from other tabs', () => {
      TestBed.resetTestingModule();
      storageProviderSpy = jasmine.createSpyObj('StorageProvider', ['getItem', 'setItem']);
      storageProviderSpy.getItem.and.returnValue([]);
      TestBed.configureTestingModule({
        providers: [
          FavoritesProvider,
          { provide: StorageProvider, useValue: storageProviderSpy },
        ],
      });
      service = TestBed.inject(FavoritesProvider);

      const newFavorites = [mockCocktail as CocktailModel];
      storageProviderSpy.getItem.and.returnValue(newFavorites);

      const storageEventHandler = addEventListenerSpy.calls.first().args[1];
      storageEventHandler({ key: 'favorites' });

      expect(service.isFavorite(mockCocktail as CocktailModel)).toBeTrue();
    });

    it('should handle storage event from other tabs when new favorites are null', () => {
      TestBed.resetTestingModule();
      storageProviderSpy = jasmine.createSpyObj('StorageProvider', ['getItem', 'setItem']);
      storageProviderSpy.getItem.and.returnValue([]);
      TestBed.configureTestingModule({
        providers: [
          FavoritesProvider,
          { provide: StorageProvider, useValue: storageProviderSpy },
        ],
      });
      service = TestBed.inject(FavoritesProvider);

      storageProviderSpy.getItem.and.returnValue(null);

      const storageEventHandler = addEventListenerSpy.calls.first().args[1];
      storageEventHandler({ key: 'favorites' });

      let currentFavorites: CocktailModel[] = [];
      service.favorites$.subscribe(favs => currentFavorites = favs);
      expect(currentFavorites).toEqual([]);
    });
  });

  describe('isFavorite', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      storageProviderSpy = jasmine.createSpyObj('StorageProvider', ['getItem', 'setItem']);
      TestBed.configureTestingModule({
        providers: [
          FavoritesProvider,
          { provide: StorageProvider, useValue: storageProviderSpy },
        ],
      });
    });

    it('should return true if cocktail is a favorite', () => {
      storageProviderSpy.getItem.and.returnValue([mockCocktail as CocktailModel]);
      service = TestBed.inject(FavoritesProvider);
      expect(service.isFavorite(mockCocktail as CocktailModel)).toBeTrue();
    });

    it('should return false if cocktail is not a favorite', () => {
      storageProviderSpy.getItem.and.returnValue([]);
      service = TestBed.inject(FavoritesProvider);
      expect(service.isFavorite(mockCocktail as CocktailModel)).toBeFalse();
    });
  });

  describe('addFavorite', () => {
    it('should add a cocktail to favorites', () => {
      service.addFavorite(mockCocktail as CocktailModel);
      expect(service.isFavorite(mockCocktail as CocktailModel)).toBeTrue();
      expect(storageProviderSpy.setItem).toHaveBeenCalledWith('favorites', [mockCocktail as CocktailModel]);
    });
  });

  describe('removeFavorite', () => {
    beforeEach(() => {
      service.addFavorite(mockCocktail as CocktailModel);
      service.addFavorite(mockCocktail2 as CocktailModel);
    });

    it('should remove a cocktail from favorites', () => {
      service.removeFavorite(mockCocktail as CocktailModel);
      expect(service.isFavorite(mockCocktail as CocktailModel)).toBeFalse();
      expect(storageProviderSpy.setItem).toHaveBeenCalledWith('favorites', [mockCocktail2 as CocktailModel]);
    });
  });

  describe('toggleFavorite', () => {
    it('should add a cocktail if it is not a favorite', () => {
      spyOn(service, 'isFavorite').and.returnValue(false);
      const addSpy = spyOn(service, 'addFavorite');
      const removeSpy = spyOn(service, 'removeFavorite');

      service.toggleFavorite(mockCocktail as CocktailModel);

      expect(addSpy).toHaveBeenCalledWith(mockCocktail as CocktailModel);
      expect(removeSpy).not.toHaveBeenCalled();
    });

    it('should remove a cocktail if it is a favorite', () => {
      spyOn(service, 'isFavorite').and.returnValue(true);
      const addSpy = spyOn(service, 'addFavorite');
      const removeSpy = spyOn(service, 'removeFavorite');

      service.toggleFavorite(mockCocktail as CocktailModel);

      expect(removeSpy).toHaveBeenCalledWith(mockCocktail as CocktailModel);
      expect(addSpy).not.toHaveBeenCalled();
    });
  });
});
