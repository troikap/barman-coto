
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredientsListComponent } from './ingredients-list.component';
import { CocktailModel } from '../../core/models/cocktail.model';
import { SimpleChange, SimpleChanges } from '@angular/core';

describe('IngredientsListComponent', () => {
  let component: IngredientsListComponent;
  let fixture: ComponentFixture<IngredientsListComponent>;

  const mockCocktail: Partial<CocktailModel> = {
    idDrink: '1',
    strDrink: 'Margarita',
    strDrinkThumb: 'margarita.jpg',
    strIngredient1: 'Tequila',
    strMeasure1: '1 1/2 oz',
    strIngredient2: 'Triple sec',
    strMeasure2: '1/2 oz',
    strIngredient3: 'Lime juice',
    strMeasure3: '1 oz',
  };

  const mockCocktailNoMeasures: Partial<CocktailModel> = {
    idDrink: '2',
    strDrink: 'Vodka Soda',
    strDrinkThumb: 'vodkasoda.jpg',
    strIngredient1: 'Vodka',
    strIngredient2: 'Soda Water',
  };

  const mockCocktailNoIngredients: Partial<CocktailModel> = {
    idDrink: '3',
    strDrink: 'Water',
    strDrinkThumb: 'water.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should extract ingredients when cocktail input changes and is not null', () => {
      const changes: SimpleChanges = {
        cocktail: new SimpleChange(null, mockCocktail, true)
      };
      component.cocktail = mockCocktail as CocktailModel;
      component.ngOnChanges(changes);
      expect(component.ingredients.length).toBe(3);
      expect(component.ingredients[0]).toEqual({ name: 'Tequila', measure: '1 1/2 oz' });
    });

    it('should not extract ingredients when cocktail input changes to null', () => {
      const changes: SimpleChanges = {
        cocktail: new SimpleChange(mockCocktail, null, false)
      };
      component.cocktail = null;
      component.ngOnChanges(changes);
      expect(component.ingredients.length).toBe(0);
    });

    it('should not extract ingredients when cocktail input does not change', () => {
      const changes: SimpleChanges = {
        someOtherInput: new SimpleChange(null, 'value', true)
      };
      component.cocktail = mockCocktail as CocktailModel;
      component.ngOnChanges(changes);
      expect(component.ingredients.length).toBe(0);
    });
  });

  describe('extractIngredients', () => {
    it('should extract ingredients with measures', () => {
      const ingredients = (component as any).extractIngredients(mockCocktail as CocktailModel);
      expect(ingredients.length).toBe(3);
      expect(ingredients[0]).toEqual({ name: 'Tequila', measure: '1 1/2 oz' });
      expect(ingredients[1]).toEqual({ name: 'Triple sec', measure: '1/2 oz' });
      expect(ingredients[2]).toEqual({ name: 'Lime juice', measure: '1 oz' });
    });

    it('should extract ingredients without measures', () => {
      const ingredients = (component as any).extractIngredients(mockCocktailNoMeasures as CocktailModel);
      expect(ingredients.length).toBe(2);
      expect(ingredients[0]).toEqual({ name: 'Vodka', measure: '' });
      expect(ingredients[1]).toEqual({ name: 'Soda Water', measure: '' });
    });

    it('should return an empty array if no ingredients', () => {
      const ingredients = (component as any).extractIngredients(mockCocktailNoIngredients as CocktailModel);
      expect(ingredients.length).toBe(0);
    });
  });
});
