
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
    if (this.initialTerm) this.searchControl.setValue(this.initialTerm);
    const searchTypeChangesWithInitial = this.searchTypeControl.valueChanges.pipe(startWith(this.searchTypeControl.value));
    searchTypeChangesWithInitial.subscribe(type => {
      if (type === null) type = 'name';
      this.updateValidators(type);
      this.searchControl.setValue('');
      if (type === 'ingredient' && this.ingredients.length === 0) {
        this.ingredientService.listIngredientsObservable().subscribe(response => {
          this.ingredients = response.drinks.map(d => d.strIngredient1);
        });
      }
      if (this.searchControl.value && this.searchControl.valid) {
        this.search.emit({ term: this.searchControl.value, type });
      }
    });
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      withLatestFrom(searchTypeChangesWithInitial),
      filter(([term, type]) => !!term)
    ).subscribe(([term, type]) => {
      if (type === null) type = 'name';
      if (this.searchControl.valid) this.search.emit({ term, type });
    });
    this.searchControl.valueChanges.subscribe((term: any) => {
      this.searchTerms.next(term || '');
      if (this.searchTypeControl.value === 'ingredient') {
        this.filteredIngredients = this.ingredients.filter(ingredient =>
          ingredient.toLowerCase().includes(term.toLowerCase())
        ).slice(0, 10);
      }
    });
  }

  private updateValidators(type: SearchType): void {
    if (type === 'name' || type === 'ingredient') {
      this.searchControl.setValidators([Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]);
    } else if (type === 'id') {
      this.searchControl.setValidators([Validators.pattern('^[0-9]*$')]);
    }
    this.searchControl.updateValueAndValidity();
  }

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
