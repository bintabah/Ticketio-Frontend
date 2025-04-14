import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from './components/layout/top-bar/top-bar.component';
import { SideBarComponent } from './components/layout/side-bar/side-bar.component';
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
    // RouterOutlet,
    TopBarComponent,
    SideBarComponent,
    MainContentComponent,
    ButtonModule,
    PanelMenuModule,
    DrawerModule,
    TableModule
  ],
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ticketio_front';
  users: User[] = [];
  items: MenuItem[] = [];
  visible = false;
  private userService = inject(UserService);

  constructor() {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        console.log('Réponse du backend :', data);
        this.users = data;
      },
      (error: Error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );

    this.items = [
      {
        label: 'Users',
        icon: 'pi pi-users',
        routerLink: '/users'
      },
      {
        label: 'Artists',
        icon: 'pi pi-star',
        routerLink: '/artists'
      },
      {
        label: 'Events',
        icon: 'pi pi-calendar',
        routerLink: '/events'
      },
      {
        label: 'Tickets',
        icon: 'pi pi-ticket',
        routerLink: '/tickets'
      }
    ];
  }
}
