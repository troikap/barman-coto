
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DrinksModel, CocktailModel } from '../../models/cocktail.model';

@Injectable({
  providedIn: 'root'
})
export class CocktailService {
  private http = inject(HttpClient);
  private readonly apiDB = environment.apiUrl;
  private readonly versionUrl = environment.versionUrl;

  /**
   * Cache for the initial list of cocktails and the letter used to fetch them.
   * This is used to restore the state when navigating back to the cocktail list page.
   */
  public initialCocktailsState: { cocktails: CocktailModel[], currentLetter: string } | null = null;

  // Search cocktail by name
  async searchCocktailByName(name: string): Promise<DrinksModel> {
    return await lastValueFrom(this.http.get<DrinksModel>(`${this.apiDB}/${this.versionUrl}/search.php?s=${name}`));
  }

  // Search cocktails by name
  searchCocktailsByNameObservable(name: string): Observable<DrinksModel> {
    return this.http.get<DrinksModel>(`${this.apiDB}/${this.versionUrl}/search.php?s=${name}`).pipe(
      map((response: any) => {
        if (response.drinks === "no data found") response.drinks = null;
        return response;
      })
    );
  }

  // Search cocktail by name
  async listCocktailsByFirstLetter(letter: string): Promise<DrinksModel> {
    return await lastValueFrom(this.http.get<DrinksModel>(`${this.apiDB}/${this.versionUrl}/search.php?f=${letter}`));
  }

  // Lookup full cocktail details by id
  async lookupCocktailById(id: string): Promise<DrinksModel> {
    return await lastValueFrom(this.http.get<DrinksModel>(`${this.apiDB}/${this.versionUrl}/lookup.php?i=${id}`));
  }

  // Lookup full cocktail details by id (Observable version)
  lookupCocktailByIdObservable(id: string): Observable<DrinksModel> {
    return this.http.get<DrinksModel>(`${this.apiDB}/${this.versionUrl}/lookup.php?i=${id}`).pipe(
      map((response: any) => {
        if (response.drinks === "no data found") response.drinks = null;
        return response;
      })
    );
  }

  // Lookup a random cocktail
  async lookupCocktailRandom(): Promise<DrinksModel> {
    return await lastValueFrom(this.http.get<DrinksModel>(`${this.apiDB}/${this.versionUrl}/random.php`));
  }

  // Search by ingredient
  async searchCocktailByIngredient(name: string): Promise<DrinksModel> {
    return await lastValueFrom(this.http.get<DrinksModel>(`${this.apiDB}/${this.versionUrl}/filter.php?i=${name}`));
  }

  // Search cocktails by ingredient (Observable version)
  searchCocktailsByIngredientObservable(name: string): Observable<DrinksModel> {
    return this.http.get<DrinksModel>(`${this.apiDB}/${this.versionUrl}/filter.php?i=${name}`).pipe(
      map((response: any) => {
        if (response.drinks === "no data found") response.drinks = null;
        return response;
      })
    );
  }

  // Filter by alcoholic (name = Alcoholic or name = Non_Alcoholic)
  async searchCocktailByAlcoholic(name: string): Promise<DrinksModel> {
    return await lastValueFrom(this.http.get<DrinksModel>(`${this.apiDB}/${this.versionUrl}/filter.php?a=${name}`));
  }

  // Filter by Category
  async searchCocktailByCategory(name: string): Promise<DrinksModel> {
    return await lastValueFrom(this.http.get<DrinksModel>(`${this.apiDB}/${this.versionUrl}/filter.php?c=${name}`));
  }

  // Filter by Glass
  async searchCocktailByGlass(name: string): Promise<DrinksModel> {
    return await lastValueFrom(this.http.get<DrinksModel>(`${this.apiDB}/${this.versionUrl}/filter.php?g=${name}`));
  }
}
