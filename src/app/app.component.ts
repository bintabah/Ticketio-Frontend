import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { TopBarComponent } from './components/layout/top-bar/top-bar.component';
import { SideBarComponent } from './components/layout/side-bar/side-bar.component';
import { AuthService } from './services/auth.service';
import { MainContentComponent } from './components/layout/main-content/main-content.component';
import { User } from './models/user.model';
import { UserService } from './services/user.service';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DrawerModule } from 'primeng/drawer';
import { TableModule } from 'primeng/table';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TopBarComponent,
    SideBarComponent,
    ButtonModule,
    PanelMenuModule,
    DrawerModule,
    TableModule
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ticketio_front';
  users: User[] = [];
  items: MenuItem[] = [];
  visible = false;
  isLoggedIn = false;

  private userService = inject(UserService);
  private router = inject(Router);
  public authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    this.userService.getUsers().subscribe(
      (data: User[]) => {
        // console.log('Réponse du backend :', data);
        this.users = data;
      },
      (error: Error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }

  get showLayout(): boolean {
    // Add checkout to public routes and check if the current route starts with /checkout/
    const publicRoutes = ['/', '/login'];
    return this.isLoggedIn && 
           !publicRoutes.includes(this.router.url) && 
           !this.router.url.startsWith('/checkout/');
  }
}
