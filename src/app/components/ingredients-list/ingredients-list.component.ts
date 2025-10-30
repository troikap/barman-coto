import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CocktailModel } from '../../core/models/cocktail.model';
import { IngredientCustomModel } from '../../core/models/ingredient.model';

@Component({
  selector: 'app-ingredients-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ingredients-list.component.html',
  styleUrl: './ingredients-list.component.scss'
})
export class IngredientsListComponent implements OnChanges {
  @Input() cocktail: CocktailModel | null = null;
  ingredients: IngredientCustomModel[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cocktail'] && this.cocktail) this.ingredients = this.extractIngredients(this.cocktail);
  }

  private extractIngredients(cocktail: CocktailModel): IngredientCustomModel[] {
    const ingredients: IngredientCustomModel[] = [];
    for (let i = 1; i <= 15; i++) {
      const ingredientName = cocktail[`strIngredient${i}` as keyof CocktailModel];
      const measure = cocktail[`strMeasure${i}` as keyof CocktailModel];
      if (ingredientName) ingredients.push({ name: ingredientName, measure: measure || '' });
    }
    return ingredients;
  }
}
