import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../../services/auth.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    MenuModule,
    FormsModule,
    TooltipModule
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent implements OnInit {
  currentUser: User | null = null;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }
  logout(): void {
    this.authService.logout();
  }
}
