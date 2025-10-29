import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CocktailModel } from '../../core/models/cocktail.model';
import { CocktailService } from '../../core/services/cocktail/cocktail.service';
import { CocktailCardComponent } from '../../components/cocktail-card/cocktail-card.component';
import { CocktailListItemComponent } from '../../components/cocktail-list-item/cocktail-list-item.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FavoritesProvider } from '../../core/providers/favorite/favorite.provider';
import { Observable } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-cocktail',
  standalone: true,
  imports: [CommonModule, CocktailCardComponent, CocktailListItemComponent, InfiniteScrollModule, HeaderComponent],
  templateUrl: './cocktail.page.html',
  styleUrl: './cocktail.page.scss',
})
export class CocktailPage implements OnInit {
  private cocktailService = inject(CocktailService);
  private favoritesProvider = inject(FavoritesProvider);

  cocktails: CocktailModel[] = [];
  favoriteCocktails$: Observable<CocktailModel[]> = this.favoritesProvider.favorites$;
  showOnlyFavorites = false;
  isGridView = true; // Default to grid view

  private currentLetter = 'a';

  ngOnInit(): void {
    this.loadCocktails();
  }

  loadCocktails() {
    this.cocktailService.listCocktailsByFirstLetter(this.currentLetter).then(response => {
      if (response.drinks) this.cocktails = [...this.cocktails, ...response.drinks];
    });
  }

  onScroll() {
    if (!this.showOnlyFavorites) {
      this.currentLetter = String.fromCharCode(this.currentLetter.charCodeAt(0) + 1);
      if (this.currentLetter.charCodeAt(0) <= 'z'.charCodeAt(0)) this.loadCocktails();
    }
  }

  toggleShowFavorites(showFavorites: boolean) {
    this.showOnlyFavorites = showFavorites;
  }

  toggleView(isGrid: boolean) {
    this.isGridView = isGrid;
  }
}
