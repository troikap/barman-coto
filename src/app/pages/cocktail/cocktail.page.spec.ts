import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CocktailService } from '../../core/services/cocktail/cocktail.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CocktailPage } from './cocktail.page';
import { CocktailModel } from '../../core/models/cocktail.model';

describe('CocktailPage', () => {
  let component: CocktailPage;
  let fixture: ComponentFixture<CocktailPage>;
  let cocktailService: CocktailService;

  const configureTestBed = (queryParams: any) => {
    TestBed.configureTestingModule({
      imports: [CocktailPage, HttpClientTestingModule],
      providers: [
        CocktailService,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of(queryParams),
            snapshot: { queryParams },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CocktailPage);
    component = fixture.componentInstance;
    cocktailService = TestBed.inject(CocktailService);
  };

  describe('with no query params', () => {
    beforeEach(() => {
      configureTestBed({});
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('with initialCocktailsState', () => {
    beforeEach(() => {
      configureTestBed({});
      const initialCocktails = [{ idDrink: '1', strDrink: 'Test Cocktail' }] as CocktailModel[];
      cocktailService.initialCocktailsState = { cocktails: initialCocktails, currentLetter: 'b' };
      fixture.detectChanges();
    });

    it('should restore state from initialCocktailsState', () => {
      expect(component.cocktails.length).toBe(1);
      expect(component.cocktails[0].idDrink).toBe('1');
    });
  });

  describe('with name search', () => {
    beforeEach(() => {
      configureTestBed({ q: 'margarita', type: 'name' });
    });

    it('should search cocktails by name', () => {
      const spy = spyOn(cocktailService, 'searchCocktailsByNameObservable').and.returnValue(of({ drinks: [] }));
      component.ngOnInit();
      expect(spy).toHaveBeenCalledWith('margarita');
    });
  });

  describe('with name search and null drinks', () => {
    beforeEach(() => {
      configureTestBed({ q: 'margarita', type: 'name' });
    });

    it('should handle null drinks in response', () => {
      const spy = spyOn(cocktailService, 'searchCocktailsByNameObservable').and.returnValue(of({ drinks: null } as any));
      component.ngOnInit();
      expect(component.cocktails).toEqual([]);
    });
  });

  describe('with ingredient search', () => {
    beforeEach(() => {
      configureTestBed({ q: 'vodka', type: 'ingredient' });
    });

    it('should search cocktails by ingredient', () => {
      const spy = spyOn(cocktailService, 'searchCocktailsByIngredientObservable').and.returnValue(of({ drinks: [] }));
      component.ngOnInit();
      expect(spy).toHaveBeenCalledWith('vodka');
    });
  });

  describe('with id search', () => {
    beforeEach(() => {
      configureTestBed({ q: '11007', type: 'id' });
    });

    it('should search cocktails by id', () => {
      const spy = spyOn(cocktailService, 'lookupCocktailByIdObservable').and.returnValue(of({ drinks: [] }));
      component.ngOnInit();
      expect(spy).toHaveBeenCalledWith('11007');
    });
  });

  describe('with invalid search type', () => {
    beforeEach(() => {
      configureTestBed({ q: 'test', type: 'invalid' });
    });

    it('should return null', () => {
      component.ngOnInit();
      expect(component.cocktails).toEqual([]);
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      configureTestBed({});
      fixture.detectChanges();
    });

    it('should save state if not in search or favorites mode', () => {
      component.searchActive = false;
      component.showOnlyFavorites = false;
      component.ngOnDestroy();
      expect(cocktailService.initialCocktailsState).not.toBeNull();
    });

    it('should not save state if in search mode', () => {
      component.searchActive = true;
      component.showOnlyFavorites = false;
      component.ngOnDestroy();
      expect(cocktailService.initialCocktailsState).toBeNull();
    });

    it('should not save state if in favorites mode', () => {
      component.searchActive = false;
      component.showOnlyFavorites = true;
      component.ngOnDestroy();
      expect(cocktailService.initialCocktailsState).toBeNull();
    });
  });
});