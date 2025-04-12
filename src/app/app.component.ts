import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ticketio_front';
  users: User[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<User[]>('/api/users').subscribe(
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

// ✅ Déclaration directe de l'interface User dans le même fichier
interface User {
  userId: number;
  name: string;
  firstName: string;
  email: string;
  contact: string;
  role: string;
}
