
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar.component';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IngredientService } from '../../core/services/ingredient/ingredient.service';
import { of } from 'rxjs';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let ingredientServiceSpy: jasmine.SpyObj<IngredientService>;

  beforeEach(async () => {
    ingredientServiceSpy = jasmine.createSpyObj('IngredientService', ['listIngredientsObservable']);
    ingredientServiceSpy.listIngredientsObservable.and.returnValue(of({ drinks: [] }));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SearchBarComponent, HttpClientTestingModule],
      providers: [
        { provide: IngredientService, useValue: ingredientServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search event on input change', fakeAsync(() => {
    spyOn(component.search, 'emit');
    const inputElement = fixture.debugElement.query(By.css('#searchInput'));
    inputElement.nativeElement.value = 'margarita';
    inputElement.nativeElement.dispatchEvent(new Event('input'));
    tick(300);
    fixture.detectChanges();
    expect(component.search.emit).toHaveBeenCalledWith({ term: 'margarita', type: 'name' });
  }));

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.initialType = 'ingredient';
      component.ngOnInit();
    });

    it('should set initialType and initialTerm if provided', () => {
      component.initialTerm = 'vodka';
      component.ngOnInit();
      expect(component.searchTypeControl.value).toBe('ingredient');
      expect(component.searchControl.value).toBe('vodka');
    });

    it('should update validators based on initialType', () => {
      component.initialType = 'id';
      component.ngOnInit();
      component.searchControl.setValue('abc');
      expect(component.searchControl.errors?.['pattern']).toBeTruthy();
    });

    it('should call listIngredientsObservable if initialType is ingredient and ingredients are empty', fakeAsync(() => {
      component.ingredients = [];
      tick();
      expect(ingredientServiceSpy.listIngredientsObservable).toHaveBeenCalled();
    }));

    it('should emit search event if initialTerm and initialType are provided and searchControl is valid', fakeAsync(() => {
      spyOn(component.search, 'emit');
      component.initialType = 'name';
      component.initialTerm = 'test';
      component.ngOnInit();
      tick(300);
      expect(component.search.emit).toHaveBeenCalledWith({ term: 'test', type: 'name' });
    }));

    it('should filter ingredients when searchTypeControl is ingredient and searchControl value changes', fakeAsync(() => {
      component.initialType = 'ingredient';
      component.ingredients = ['Vodka', 'Gin'];
      component.ngOnInit();
      tick();
      component.searchControl.setValue('vod');
      tick(300);
      expect(component.filteredIngredients).toEqual(['Vodka']);
    }));
  });

  describe('updateValidators', () => {
    it('should set validators for name or ingredient type', () => {
      (component as any).updateValidators('name');
      component.searchControl.setValue('a'.repeat(51));
      expect(component.searchControl.errors?.['maxlength']).toBeTruthy();
      component.searchControl.setValue('123');
      expect(component.searchControl.errors?.['pattern']).toBeTruthy();
    });

    it('should set validators for id type', () => {
      (component as any).updateValidators('id');
      component.searchControl.setValue('abc');
      expect(component.searchControl.errors?.['pattern']).toBeTruthy();
    });
  });

  describe('onIngredientSelect', () => {
    it('should set searchControl value, emit search event, and clear filteredIngredients', () => {
      spyOn(component.search, 'emit');
      component.filteredIngredients = ['Vodka'];
      component.onIngredientSelect('Vodka');
      expect(component.searchControl.value).toBe('Vodka');
      expect(component.search.emit).toHaveBeenCalledWith({ term: 'Vodka', type: 'ingredient' });
      expect(component.filteredIngredients).toEqual([]);
    });
  });

  describe('placeholderText', () => {
    it('should return correct placeholder for name type', () => {
      component.searchTypeControl.setValue('name');
      expect(component.placeholderText).toBe('Busca cócteles por nombre...');
    });

    it('should return correct placeholder for ingredient type', () => {
      component.searchTypeControl.setValue('ingredient');
      expect(component.placeholderText).toBe('Busca cócteles por ingrediente...');
    });

    it('should return correct placeholder for id type', () => {
      component.searchTypeControl.setValue('id');
      expect(component.placeholderText).toBe('Busca cócteles por ID (solo números)...');
    });

    it('should return default placeholder for unknown type', () => {
      component.searchTypeControl.setValue(null as any);
      expect(component.placeholderText).toBe('Busca cócteles...');
    });
  });
});
