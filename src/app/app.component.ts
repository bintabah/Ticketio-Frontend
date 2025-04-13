import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { User } from './models/user.model';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ticketio_front';
  users: User[] = [];
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
  }
}
