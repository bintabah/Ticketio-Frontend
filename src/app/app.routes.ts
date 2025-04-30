import { Routes } from '@angular/router';
import { UsersComponent } from './components/views/users/users.component';
import { EventsComponent } from './components/views/events/events.component';
import { ArtistsComponent } from './components/views/artists/artists.component';
import { TicketsComponent } from './components/views/tickets/tickets.component';

export const routes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: 'users', component: UsersComponent },
    { path: 'events', component: EventsComponent },
    { path: 'artists', component: ArtistsComponent },
    { path: 'tickets', component: TicketsComponent },
];
