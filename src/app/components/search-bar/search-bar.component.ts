
import { Component, EventEmitter, Output, OnInit, inject, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, withLatestFrom } from 'rxjs/operators';
import { Subject, startWith } from 'rxjs';
import { IngredientService } from '../../core/services/ingredient/ingredient.service';

export type SearchType = 'name' | 'ingredient' | 'id';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class SearchBarComponent implements OnInit {
  @Input() initialTerm: string | null = null;
  @Input() initialType: SearchType | null = null;
  @Output() search = new EventEmitter<{ term: string; type: SearchType }>();
  private ingredientService = inject(IngredientService);
  searchControl = new FormControl('');
  searchTypeControl = new FormControl<SearchType>('name');
  ingredients: string[] = [];
  filteredIngredients: string[] = [];
  private searchTerms = new Subject<string>();

  ngOnInit(): void {
    if (this.initialType) this.searchTypeControl.setValue(this.initialType);
    const searchTypeChangesWithInitial = this.searchTypeControl.valueChanges.pipe(startWith(this.searchTypeControl.value));
    if (this.initialTerm) this.searchControl.setValue(this.initialTerm);

    // Subscribe to search type changes to update validators and load ingredients
    searchTypeChangesWithInitial.subscribe(type => {
      if (type === null) type = 'name';
      this.updateValidators(type);
      if (type === 'ingredient' && this.ingredients.length === 0) {
        this.ingredientService.listIngredientsObservable().subscribe(response => {
          this.ingredients = response.drinks.map(d => d.strIngredient1);
        });
      }
      if (this.searchControl.value && this.searchControl.valid) {
        this.search.emit({ term: this.searchControl.value, type });
      }
    });

    // Debounce search input to avoid excessive API calls
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      withLatestFrom(searchTypeChangesWithInitial),
      filter(([term, type]) => !!term)
    ).subscribe(([term, type]) => {
      if (type === null) type = 'name';
      if (this.searchControl.valid) this.search.emit({ term, type });
    });

    // Filter ingredients as the user types
    this.searchControl.valueChanges.subscribe((term: any) => {
      this.searchTerms.next(term || '');
      if (this.searchTypeControl.value === 'ingredient') {
        this.filteredIngredients = this.ingredients.filter(ingredient =>
          ingredient.toLowerCase().includes(term.toLowerCase())
        ).slice(0, 10);
      }
    });
  }

  /**
   * Updates the validators for the search control based on the selected search type.
   * @param type The selected search type.
   */
  private updateValidators(type: SearchType): void {
    if (type === 'name' || type === 'ingredient') {
      this.searchControl.setValidators([Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]);
    } else if (type === 'id') {
      this.searchControl.setValidators([Validators.pattern('^[0-9]*$')]);
    }
    this.searchControl.updateValueAndValidity();
  }

  /**
   * Emits a search event when an ingredient is selected from the list.
   * @param ingredient The selected ingredient.
   */
  onIngredientSelect(ingredient: string): void {
    this.searchControl.setValue(ingredient);
    this.search.emit({ term: ingredient, type: 'ingredient' });
    this.filteredIngredients = [];
  }

  get placeholderText(): string {
    switch (this.searchTypeControl.value) {
      case 'name':
        return 'Busca cócteles por nombre...';
      case 'ingredient':
        return 'Busca cócteles por ingrediente...';
      case 'id':
        return 'Busca cócteles por ID (solo números)...';
      default:
        return 'Busca cócteles...';
    }
  }
}
