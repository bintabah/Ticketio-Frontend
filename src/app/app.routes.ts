import { Routes } from '@angular/router';
import { ArtistsListComponent } from './components/layout/artists-list/artists-list.component';
import { UsersComponent } from './components/entities/users/users.component';
import { EventsComponent } from './components/entities/events/events.component';

export const routes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: 'users', component: UsersComponent },
    { path: 'events', component: EventsComponent },
    { path: 'artists', component: ArtistsListComponent },
]; 
