import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { lastValueFrom, Observable } from 'rxjs';
import { IngredientListModel } from '../../models/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private http = inject(HttpClient);
  private readonly apiDB = environment.apiUrl;
  private readonly versionUrl = environment.versionUrl;

  // List the ingredients 
  async listIngredients(): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.apiDB}/${this.versionUrl}/list.php?i=list`));
  }

  // List all ingredients Observable
  listIngredientsObservable(): Observable<IngredientListModel> {
    return this.http.get<IngredientListModel>(`${this.apiDB}/${this.versionUrl}/list.php?i=list`);
  }

  // Search ingredient by name
  async searchIngredientByName(name: string): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.apiDB}/${this.versionUrl}/search.php?i=${name}`));
  }

  // Lookup ingredient by ID
  async lookupIngredientById(id: string): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.apiDB}/${this.versionUrl}/lookup.php?iid=${id}`));
  }
}
