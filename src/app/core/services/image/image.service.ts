import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// Solo para documentar los EP de imagenes, seguramente los arme en algun provider para usar armar las rutas y utilice directamente en img..
export class ImageService {
  private http = inject(HttpClient);
  private readonly apiDB = environment.apiUrl;

  // Images Drink thumbnails
  async getDrinkImage(name: string, size: 'small' | 'medium' | 'large'): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.apiDB}/images/media/drink/${name}.jpg/${size}`));
  }

  // Images Ingredient thumbnails
  async getIngredientImage(name: string, size: 'small' | 'medium' | null): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.apiDB}/images/ingredients/${name}${size ? ('-' + size) : ''}.png`));
  }
}
