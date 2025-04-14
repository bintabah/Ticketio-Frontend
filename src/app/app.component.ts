import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { User } from './models/user.model';
import { UserService } from './services/user.service';
import { ButtonDemoComponent } from './components/button-demo/button-demo.component';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DrawerModule } from 'primeng/drawer';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ButtonDemoComponent, ButtonModule, PanelMenuModule, DrawerModule],
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ticketio_front';
  users: User[] = [];
  items: MenuItem[] = [];
  visible = false;
  private userService = inject(UserService);

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        console.log('Réponse du backend :', data);
        this.users = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );

    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/'
      },
      {
        label: 'About',
        icon: 'pi pi-info',
        routerLink: '/about'
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope',
        routerLink: '/contact'
      }
    ];
  }
}
