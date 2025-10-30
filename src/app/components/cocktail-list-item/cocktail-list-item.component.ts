import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CocktailModel } from '../../core/models/cocktail.model';
import { FavoritesProvider } from '../../core/providers/favorite/favorite.provider';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IngredientsListComponent } from '../ingredients-list/ingredients-list.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cocktail-list-item',
  standalone: true,
  imports: [CommonModule, IngredientsListComponent],
  templateUrl: './cocktail-list-item.component.html',
  styleUrl: './cocktail-list-item.component.scss',
})
export class CocktailListItemComponent implements OnInit {
  @Input() cocktail: CocktailModel | null = null;
  private favoritesProvider = inject(FavoritesProvider);
  isFavorite$: Observable<boolean> = new Observable<boolean>();
  smallImageUrl: string = '';

  ngOnInit() {
    if (this.cocktail) {
      this.isFavorite$ = this.favoritesProvider.favorites$.pipe(
        map(favorites => favorites.some(fav => fav.idDrink === this.cocktail!.idDrink))
      );
      // Construir la URL de la imagen pequeña directamente
      const thumbUrl = this.cocktail.strDrinkThumb;
      const fileNameWithExtension = thumbUrl.substring(thumbUrl.lastIndexOf('/') + 1);
      const fileName = fileNameWithExtension.split('.')[0];
      this.smallImageUrl = `${environment.apiUrl}/images/media/drink/${fileName}.jpg/small`;
    }
  }

  toggleFavorite() {
    if (this.cocktail) this.favoritesProvider.toggleFavorite(this.cocktail);
  }
}
