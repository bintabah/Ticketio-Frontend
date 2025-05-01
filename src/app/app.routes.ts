import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/views/login/login.component';
import { UnauthorizedComponent } from './components/views/unauthorized/unauthorized.component';
import { TicketsComponent } from './components/views/tickets/tickets.component';
import { EventsComponent } from './components/views/events/events.component';
import { ArtistsComponent } from './components/views/artists/artists.component';
import { UsersComponent } from './components/views/users/users.component';
import { StatisticsComponent } from './components/views/statistics/statistics.component';
import { EventsFormComponent } from './components/forms/events/events.component';
import { PublicHomeComponent } from './components/views/public-home/public-home.component';
import { CheckoutComponent } from './components/views/checkout/checkout.component';
import { SuccessComponent } from './components/views/success/success.component';

export const routes: Routes = [
  { path: '', component: PublicHomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'checkout/:id', component: CheckoutComponent },
  { path: 'success', component: SuccessComponent },

  { 
    path: 'admin',
    redirectTo: 'admin/statistics',
    pathMatch: 'full'
  },
  { 
    path: 'admin/statistics', 
    component: StatisticsComponent, 
    canActivate: [AuthGuard],
    data: { requiredRole: 'admin' } 
  },
  { 
    path: 'admin/tickets', 
    component: TicketsComponent, 
    canActivate: [AuthGuard],
    data: { requiredRole: 'admin' } 
  },
  { 
    path: 'admin/events', 
    component: EventsComponent, 
    canActivate: [AuthGuard],
    data: { requiredRole: 'admin' } 
  },
  { 
    path: 'admin/artists', 
    component: ArtistsComponent, 
    canActivate: [AuthGuard],
    data: { requiredRole: 'admin' } 
  },
  { 
    path: 'admin/users', 
    component: UsersComponent, 
    canActivate: [AuthGuard],
    data: { requiredRole: 'admin' } 
  },

  { path: '**', redirectTo: '/' }
];
