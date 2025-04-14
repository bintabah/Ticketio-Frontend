import { Routes } from '@angular/router';
import { UsersComponent } from './components/entities/users/users.component';
import { EventsComponent } from './components/entities/events/events.component';
// import { ButtonDemoComponent } from './components/button-demo/button-demo.component';

export const routes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: 'users', component: UsersComponent },
    { path: 'events', component: EventsComponent },
    // Add other entity routes here as they are created
    // { path: 'artists', component: ArtistsComponent },
    // { path: 'tickets', component: TicketsComponent },
]; 