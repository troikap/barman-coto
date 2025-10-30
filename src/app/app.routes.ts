import { Routes } from '@angular/router';
import { CocktailPage } from './pages/cocktail/cocktail.page';
import { CocktailDetailPage } from './pages/cocktail-detail/cocktail-detail.page';

export const routes: Routes = [
    { path: '', redirectTo: 'cocktails', pathMatch: 'full' },
    { path: 'cocktails', component: CocktailPage },
    { path: 'cocktails/:id', component: CocktailDetailPage },
];