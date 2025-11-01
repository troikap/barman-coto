import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CocktailModel } from '../../models/cocktail.model';
import { StorageProvider } from '../storage/storage.provider';

@Injectable({
  providedIn: 'root'
})
export class FavoritesProvider {
  private storageProvider = inject(StorageProvider);
  private favoritesSubject = new BehaviorSubject<CocktailModel[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  private readonly FAVORITES_KEY = 'favorites';

  constructor() {
    // Load favorites from storage on initialization
    const storedFavorites = this.storageProvider.getItem<CocktailModel[]>(this.FAVORITES_KEY);
    if (storedFavorites) this.favoritesSubject.next(storedFavorites);

    // Listen for storage changes from other tabs
    window.addEventListener('storage', event => {
      if (event.key === this.FAVORITES_KEY) {
        const newFavorites = this.storageProvider.getItem<CocktailModel[]>(this.FAVORITES_KEY);
        this.favoritesSubject.next(newFavorites || []);
      }
    });
  }

  isFavorite(cocktail: CocktailModel): boolean {
    return this.favoritesSubject.value.some(fav => fav.idDrink === cocktail.idDrink);
  }

  addFavorite(cocktail: CocktailModel): void {
    const favorites = [...this.favoritesSubject.value, cocktail];
    this.favoritesSubject.next(favorites);
    this.storageProvider.setItem(this.FAVORITES_KEY, favorites);
  }

  removeFavorite(cocktail: CocktailModel): void {
    const favorites = this.favoritesSubject.value.filter(fav => fav.idDrink !== cocktail.idDrink);
    this.favoritesSubject.next(favorites);
    this.storageProvider.setItem(this.FAVORITES_KEY, favorites);
  }

  /**
   * Toggles the favorite status of a cocktail.
   * If the cocktail is already a favorite, it will be removed. Otherwise, it will be added.
   * @param cocktail The cocktail to toggle.
   */
  toggleFavorite(cocktail: CocktailModel): void {
    if (this.isFavorite(cocktail)) this.removeFavorite(cocktail)
    else this.addFavorite(cocktail);
  }
}
