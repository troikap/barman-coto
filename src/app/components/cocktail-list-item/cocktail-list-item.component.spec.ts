

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CocktailListItemComponent } from './cocktail-list-item.component';
import { FavoritesProvider } from '../../core/providers/favorite/favorite.provider';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CocktailModel } from '../../core/models/cocktail.model';
import { environment } from '../../../environments/environment';

describe('CocktailListItemComponent', () => {
  let component: CocktailListItemComponent;
  let fixture: ComponentFixture<CocktailListItemComponent>;
  let favoritesProviderSpy: jasmine.SpyObj<FavoritesProvider>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockCocktail: Partial<CocktailModel> = {
    idDrink: '1',
    strDrink: 'Margarita',
    strDrinkThumb: 'http://www.thecocktaildb.com/images/media/drink/margarita.jpg',
  };

  beforeEach(async () => {
    favoritesProviderSpy = jasmine.createSpyObj('FavoritesProvider', ['favorites$', 'toggleFavorite']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    favoritesProviderSpy.favorites$ = of([]);

    await TestBed.configureTestingModule({
      imports: [CocktailListItemComponent],
      providers: [
        { provide: FavoritesProvider, useValue: favoritesProviderSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CocktailListItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize isFavorite$ and smallImageUrl when cocktail is provided', () => {
      component.cocktail = mockCocktail as CocktailModel;
      favoritesProviderSpy.favorites$ = of([mockCocktail as CocktailModel]);
      fixture.detectChanges();
      component.ngOnInit();
      component.isFavorite$.subscribe(isFav => {
        expect(isFav).toBeTrue();
      });
      expect(component.smallImageUrl).toBe(`${environment.apiUrl}/images/media/drink/margarita.jpg/small`);
    });

    it('should not initialize isFavorite$ and smallImageUrl when cocktail is null', () => {
      component.cocktail = null;
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.smallImageUrl).toBe('');
    });
  });

  describe('toggleFavorite', () => {
    it('should call favoritesProvider.toggleFavorite when cocktail is not null', () => {
      component.cocktail = mockCocktail as CocktailModel;
      component.toggleFavorite();
      expect(favoritesProviderSpy.toggleFavorite).toHaveBeenCalledWith(mockCocktail as CocktailModel);
    });

    it('should not call favoritesProvider.toggleFavorite when cocktail is null', () => {
      component.cocktail = null;
      component.toggleFavorite();
      expect(favoritesProviderSpy.toggleFavorite).not.toHaveBeenCalled();
    });
  });

  describe('viewDetails', () => {
    it('should navigate to cocktail details when cocktail is not null', () => {
      component.cocktail = mockCocktail as CocktailModel;
      component.viewDetails();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/cocktails', mockCocktail.idDrink]);
    });

    it('should not navigate when cocktail is null', () => {
      component.cocktail = null;
      component.viewDetails();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });
});
