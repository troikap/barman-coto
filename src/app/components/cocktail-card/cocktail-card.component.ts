import { Component, Input, inject, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CocktailModel } from '../../core/models/cocktail.model';
import { FavoritesProvider } from '../../core/providers/favorite/favorite.provider';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IngredientsListComponent } from '../ingredients-list/ingredients-list.component';
import { Router } from '@angular/router';

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
  private elementRef = inject(ElementRef);
  private router = inject(Router);
  isFavorite$: Observable<boolean> = new Observable<boolean>();
  showMenu: boolean = false;

  ngOnInit() {
    if (this.cocktail) {
      this.isFavorite$ = this.favoritesProvider.favorites$.pipe(
        map(favorites => favorites.some(fav => fav.idDrink === this.cocktail!.idDrink))
      );
    }
  }

  toggleFavorite() {
    if (this.cocktail) this.favoritesProvider.toggleFavorite(this.cocktail);
    this.showMenu = false;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  viewDetails() {
    if (this.cocktail) this.router.navigate(['/cocktails', this.cocktail.idDrink]);
    this.showMenu = false;
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) this.showMenu = false;
  }
}
