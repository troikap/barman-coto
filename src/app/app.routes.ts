import { Routes } from '@angular/router';
import { CocktailPage } from './pages/cocktail/cocktail.page';

export const routes: Routes = [
    { path: '', redirectTo: 'cocktail', pathMatch: 'full' },
    { path: 'cocktail', component: CocktailPage }
];