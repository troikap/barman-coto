import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CocktailService {
  private http = inject(HttpClient);
  private readonly apiDB = environment.apiUrl;
  private readonly versionUrl = environment.versionUrl;

  // Search cocktail by name
  async searchCocktailByName(name: string): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.apiDB}/${this.versionUrl}/search.php?s=${name}`));
  }

  // Search cocktail by name
  async listCocktailsByFirstLetter(letter: string): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.apiDB}/${this.versionUrl}/search.php?f=${letter}`));
  }

  // Lookup full cocktail details by id
  async lookupCocktailById(id: string): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.apiDB}/${this.versionUrl}/lookup.php?i=${id}`));
  }

  // Lookup a random cocktail
  async lookupCocktailRandom(): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.apiDB}/${this.versionUrl}/random.php`));
  }

  // Search by ingredient
  async searchCocktailByIngredient(name: string): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.apiDB}/${this.versionUrl}/filter.php?i=${name}`));
  }

  // Filter by alcoholic (name = Alcoholic or name = Non_Alcoholic)
  async searchCocktailByAlcoholic(name: string): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.apiDB}/${this.versionUrl}/filter.php?a=${name}`));
  }

  // Filter by Category
  async searchCocktailByCategory(name: string): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.apiDB}/${this.versionUrl}/filter.php?c=${name}`));
  }

  // Filter by Glass
  async searchCocktailByGlass(name: string): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.apiDB}/${this.versionUrl}/filter.php?g=${name}`));
  }
}
