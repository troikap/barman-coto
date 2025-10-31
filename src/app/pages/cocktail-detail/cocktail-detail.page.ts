import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CocktailService } from '../../core/services/cocktail/cocktail.service';
import { CocktailModel } from '../../core/models/cocktail.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HeaderComponent } from '../../components/header/header.component';
import { IngredientsListComponent } from '../../components/ingredients-list/ingredients-list.component';

@Component({
  selector: 'app-cocktail-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, IngredientsListComponent],
  templateUrl: './cocktail-detail.page.html',
  styleUrl: './cocktail-detail.page.scss',
})
export class CocktailDetailPage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private cocktailService = inject(CocktailService);
  private location = inject(Location);
  cocktail: CocktailModel | undefined;
  isLoading = true;
  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      const id = params.get('id');
      if (id) this.loadCocktailDetails(id)
      else this.goBack();
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadCocktailDetails(id: string): void {
    this.isLoading = true;
    this.cocktailService.lookupCocktailByIdObservable(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        if (response && response.drinks && response.drinks.length > 0) {
          this.cocktail = response.drinks[0];
        } else {
          this.cocktail = undefined;
        }
        this.isLoading = false;
        setTimeout(() => {
          const heading = document.getElementById('cocktail-name-heading');
          heading?.focus();
        }, 0);
      },
      error => {
        console.error('Error loading cocktail details:', error);
        this.cocktail = undefined;
        this.isLoading = false;
      }
    );
  }

  goBack(): void {
    this.location.back();
  }
}

