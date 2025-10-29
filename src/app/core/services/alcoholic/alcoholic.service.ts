import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlcoholicService {
  private http = inject(HttpClient);
  private readonly apiDB = environment.apiUrl;
  private readonly versionUrl = environment.versionUrl;

  // List the alcoholic 
  async listAlcoholic(): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.apiDB}/${this.versionUrl}/list.php?a=list`));
  }
}
