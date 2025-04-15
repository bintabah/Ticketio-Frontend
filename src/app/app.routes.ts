import { Routes } from '@angular/router';
import { ArtistsComponent } from './components/entities/artists/artists.component';
import { UsersComponent } from './components/entities/users/users.component';
import { EventsComponent } from './components/entities/events/events.component';

export const routes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: 'users', component: UsersComponent },
    { path: 'events', component: EventsComponent },
    { path: 'artists', component: ArtistsComponent },
]; 
