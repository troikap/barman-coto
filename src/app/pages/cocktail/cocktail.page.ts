

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CocktailModel } from '../../core/models/cocktail.model';
import { CocktailService } from '../../core/services/cocktail/cocktail.service';
import { CocktailCardComponent } from '../../components/cocktail-card/cocktail-card.component';
import { CocktailListItemComponent } from '../../components/cocktail-list-item/cocktail-list-item.component';
import { CocktailSkeletonCardComponent } from '../../components/cocktail-skeleton-card/cocktail-skeleton-card.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FavoritesProvider } from '../../core/providers/favorite/favorite.provider';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { HeaderComponent } from '../../components/header/header.component';
import { SearchBarComponent, SearchType } from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-cocktail',
  standalone: true,
  imports: [
    CommonModule,
    CocktailCardComponent,
    CocktailListItemComponent,
    CocktailSkeletonCardComponent, // Added here
    InfiniteScrollModule,
    HeaderComponent,
    SearchBarComponent,
  ],
  templateUrl: './cocktail.page.html',
  styleUrl: './cocktail.page.scss',
})
export class CocktailPage implements OnInit, OnDestroy {
  private cocktailService = inject(CocktailService);
  private favoritesProvider = inject(FavoritesProvider);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cocktails: CocktailModel[] = [];
  initialCocktails: CocktailModel[] = [];
  favoriteCocktails$: Observable<CocktailModel[]> = this.favoritesProvider.favorites$;
  showOnlyFavorites = false;
  isGridView = true;
  searchActive = false;
  showFilters = false;
  isLoading = true;
  isLoadingMore = false;
  initialSearchTerm: string | null = null;
  initialSearchType: SearchType | null = null;

  private currentLetter = 'a';
  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    // Restore state if it exists in the service
    if (this.cocktailService.initialCocktailsState) {
      this.cocktails = this.cocktailService.initialCocktailsState.cocktails;
      this.initialCocktails = this.cocktailService.initialCocktailsState.cocktails;
      this.currentLetter = this.cocktailService.initialCocktailsState.currentLetter;
      this.isLoading = false;
      this.cocktailService.initialCocktailsState = null; // Clear state after restoring
      return;
    }

    // Subscribe to query params to handle search and filtering
    this.route.queryParams
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap(params => {
          this.isLoading = true;
          const searchTerm = params['q'];
          const searchType: SearchType = params['type'] || 'name';
          this.initialSearchTerm = searchTerm;
          this.initialSearchType = searchType;
          this.searchActive = !!searchTerm;
          this.showFilters = !!searchTerm;

          // If there is a search term, perform a search
          if (searchTerm) {
            switch (searchType) {
              case 'name':
                return this.cocktailService.searchCocktailsByNameObservable(searchTerm);
              case 'ingredient':
                return this.cocktailService.searchCocktailsByIngredientObservable(searchTerm);
              case 'id':
                return this.cocktailService.lookupCocktailByIdObservable(searchTerm);
              default:
                return of(null);
            }
          } else {
            // If there is no search term, load the initial list of cocktails
            this.cocktails = [];
            this.initialCocktails = [];
            this.currentLetter = 'a';
            this.loadCocktails(true);
            return of(null);
          }
        })
      )
      .subscribe(response => {
        if (response) this.cocktails = response.drinks || [];
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    // Save the current state to the service if not in search or favorites mode
    if (!this.searchActive && !this.showOnlyFavorites) {
      this.cocktailService.initialCocktailsState = {
        cocktails: this.initialCocktails,
        currentLetter: this.currentLetter,
      };
    }
    // Unsubscribe from all subscriptions
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Loads cocktails from the API based on the current letter.
   * @param isInitialLoad Whether it is the initial load of cocktails.
   */
  loadCocktails(isInitialLoad = false) {
    if (isInitialLoad) this.isLoading = true
    else this.isLoadingMore = true;
    this.cocktailService.listCocktailsByFirstLetter(this.currentLetter).then(response => {
      if (response.drinks) {
        this.cocktails = [...this.cocktails, ...response.drinks];
        if (!this.searchActive) {
          this.initialCocktails = [...this.initialCocktails, ...response.drinks];
        }
      }
      if (isInitialLoad) this.isLoading = false
      else this.isLoadingMore = false;
    });
  }

  /**
   * Loads more cocktails when the user scrolls to the bottom of the page.
   */
  onScroll() {
    if (!this.isLoadingMore && !this.showOnlyFavorites && !this.route.snapshot.queryParams['q']) {
      this.currentLetter = String.fromCharCode(this.currentLetter.charCodeAt(0) + 1);
      if (this.currentLetter.charCodeAt(0) <= 'z'.charCodeAt(0)) this.loadCocktails();
    }
  }

  /**
   * Toggles the view to show only favorite cocktails.
   * @param showFavorites Whether to show only favorite cocktails.
   */
  toggleShowFavorites(showFavorites: boolean) {
    this.cocktailService.initialCocktailsState = null;
    this.showOnlyFavorites = showFavorites;
    this.showFilters = false;
    this.router.navigate([], { queryParams: { q: null, type: null }, queryParamsHandling: 'merge' });
  }

  /**
   * Toggles the visibility of the search filters.
   * @param show Whether to show the search filters.
   */
  toggleShowFilters(show: boolean) {
    this.cocktailService.initialCocktailsState = null;
    this.showOnlyFavorites = false;
    this.showFilters = show;
    if (!show) {
      this.router.navigate([], { queryParams: { q: null, type: null }, queryParamsHandling: 'merge' });
      this.cocktails = this.initialCocktails;
      this.searchActive = false;
    }
  }

  toggleView(isGrid: boolean) {
    this.isGridView = isGrid;
  }

  /**
   * Performs a search when the user submits the search form.
   * @param searchData The search term and type.
   */
  onSearch(searchData: { term: string; type: SearchType }) {
    this.cocktailService.initialCocktailsState = null;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: searchData.term || null, type: searchData.type || null },
      queryParamsHandling: 'merge',
    });
  }
}
