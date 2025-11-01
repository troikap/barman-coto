

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CocktailCardComponent } from './cocktail-card.component';
import { FavoritesProvider } from '../../core/providers/favorite/favorite.provider';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { CocktailModel } from '../../core/models/cocktail.model';

describe('CocktailCardComponent', () => {
  let component: CocktailCardComponent;
  let fixture: ComponentFixture<CocktailCardComponent>;
  let favoritesProviderSpy: jasmine.SpyObj<FavoritesProvider>;
  let routerSpy: jasmine.SpyObj<Router>;
  let favoritesSubject: BehaviorSubject<CocktailModel[]>;

  const mockCocktail: Partial<CocktailModel> = {
    idDrink: '1',
    strDrink: 'Margarita',
    strDrinkThumb: 'margarita.jpg',
  };

  beforeEach(async () => {
    favoritesSubject = new BehaviorSubject<CocktailModel[]>([]);
    favoritesProviderSpy = jasmine.createSpyObj('FavoritesProvider', [], { favorites$: favoritesSubject });
    favoritesProviderSpy.toggleFavorite = jasmine.createSpy('toggleFavorite');
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CocktailCardComponent],
      providers: [
        { provide: FavoritesProvider, useValue: favoritesProviderSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CocktailCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize isFavorite$ when cocktail is provided', () => {
      component.cocktail = mockCocktail as CocktailModel;
      favoritesSubject.next([mockCocktail as CocktailModel]);
      fixture.detectChanges();
      component.ngOnInit();
      component.isFavorite$.subscribe(isFav => {
        expect(isFav).toBeTrue();
      });
    });

    it('should not initialize isFavorite$ when cocktail is null', () => {
      component.cocktail = null;
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.isFavorite$).toBeDefined();
    });
  });

  describe('toggleFavorite', () => {
    it('should call favoritesProvider.toggleFavorite and set showMenu to false when cocktail is not null', () => {
      component.cocktail = mockCocktail as CocktailModel;
      component.showMenu = true;
      component.toggleFavorite();
      expect(favoritesProviderSpy.toggleFavorite).toHaveBeenCalledWith(mockCocktail as CocktailModel);
      expect(component.showMenu).toBeFalse();
    });

    it('should not call favoritesProvider.toggleFavorite when cocktail is null', () => {
      component.cocktail = null;
      component.showMenu = true;
      component.toggleFavorite();
      expect(favoritesProviderSpy.toggleFavorite).not.toHaveBeenCalled();
      expect(component.showMenu).toBeFalse();
    });
  });

  describe('toggleMenu', () => {
    it('should toggle showMenu from false to true', () => {
      component.showMenu = false;
      component.toggleMenu();
      expect(component.showMenu).toBeTrue();
    });

    it('should toggle showMenu from true to false', () => {
      component.showMenu = true;
      component.toggleMenu();
      expect(component.showMenu).toBeFalse();
    });
  });

  describe('viewDetails', () => {
    it('should navigate to cocktail details and set showMenu to false when cocktail is not null', () => {
      component.cocktail = mockCocktail as CocktailModel;
      component.showMenu = true;
      component.viewDetails();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/cocktails', mockCocktail.idDrink]);
      expect(component.showMenu).toBeFalse();
    });

    it('should not navigate when cocktail is null', () => {
      component.cocktail = null;
      component.showMenu = true;
      component.viewDetails();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
      expect(component.showMenu).toBeFalse();
    });
  });

  describe('onDocumentClick', () => {
    it('should set showMenu to false if click is outside the component', () => {
      component.showMenu = true;
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);
      const event = new MouseEvent('click', { bubbles: true });
      spyOnProperty(event, 'target').and.returnValue(outsideElement);
      component.onDocumentClick(event);
      expect(component.showMenu).toBeFalse();
      document.body.removeChild(outsideElement);
    });

    it('should not set showMenu to false if click is inside the component', () => {
      component.showMenu = true;
      const insideElement = fixture.debugElement.nativeElement;
      const event = new MouseEvent('click', { bubbles: true });
      spyOnProperty(event, 'target').and.returnValue(insideElement);
      component.onDocumentClick(event);
      expect(component.showMenu).toBeTrue();
    });
  });
});
