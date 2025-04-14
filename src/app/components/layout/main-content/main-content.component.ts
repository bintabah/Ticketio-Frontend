import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FooterComponent } from '../footer/footer.component';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FooterComponent
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent implements OnInit {
  users: User[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<User[]>('/api/users').subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        // Here you could add error handling, like showing a message to the user
      }
    });
  }

  onEdit(user: User) {
    console.log('Edit user:', user);
  }

  onDelete(user: User) {
    console.log('Delete user:', user);
  }
}
