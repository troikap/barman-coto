import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CocktailModel } from '../../core/models/cocktail.model';
import { FavoritesProvider } from '../../core/providers/favorite/favorite.provider';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IngredientsListComponent } from '../ingredients-list/ingredients-list.component';

@Component({
  selector: 'app-cocktail-card',
  standalone: true,
  imports: [CommonModule, IngredientsListComponent],
  templateUrl: './cocktail-card.component.html',
  styleUrl: './cocktail-card.component.scss',
})
export class CocktailCardComponent implements OnInit {
  @Input() cocktail: CocktailModel | null = null;
  private favoritesProvider = inject(FavoritesProvider);
  isFavorite$: Observable<boolean> = new Observable<boolean>();

  ngOnInit() {
    if (this.cocktail) {
      this.isFavorite$ = this.favoritesProvider.favorites$.pipe(
        map(favorites => favorites.some(fav => fav.idDrink === this.cocktail!.idDrink))
      );
    }
  }

  toggleFavorite() {
    if (this.cocktail) this.favoritesProvider.toggleFavorite(this.cocktail);
  }
}
