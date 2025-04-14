import { Routes } from '@angular/router';
import { ArtistsListComponent } from './components/layout/artists-list/artists-list.component';

export const routes: Routes = [
  { path: 'artists', component: ArtistsListComponent },
  { path: '', redirectTo: 'artists', pathMatch: 'full' }
];
