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
    const storedFavorites = this.storageProvider.getItem<CocktailModel[]>(this.FAVORITES_KEY);
    if (storedFavorites) this.favoritesSubject.next(storedFavorites);
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

  toggleFavorite(cocktail: CocktailModel): void {
    if (this.isFavorite(cocktail)) this.removeFavorite(cocktail)
    else this.addFavorite(cocktail);
  }
}
