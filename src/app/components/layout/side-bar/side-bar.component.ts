import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, PanelMenuModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit {
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Users',
        icon: 'pi pi-users',
        routerLink: '/users',
        expanded: true
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
