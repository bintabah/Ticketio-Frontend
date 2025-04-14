import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

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
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent implements OnInit {
  users: User[] = [];

  ngOnInit() {
    // Mock data - replace with actual API call
    this.users = [
      {
        id: 1,
        nom: 'Jean',
        prenom: 'Dupont',
        email: 'jean.dupont@example.com',
        role: 'Admin'
      },
      {
        id: 2,
        nom: 'Marie',
        prenom: 'Martin',
        email: 'marie.martin@example.com',
        role: 'User'
      },
      {
        id: 3,
        nom: 'Pierre',
        prenom: 'Durand',
        email: 'pierre.durand@example.com',
        role: 'User'
      },
      {
        id: 4,
        nom: 'Isabelle',
        prenom: 'Petit',
        email: 'isabelle.petit@example.com',
        role: 'User'
      },
      {
        id: 5,
        nom: 'Thomas',
        prenom: 'Moreau',
        email: 'thomas.moreau@example.c',
        role: 'User'
      },
      {
        id: 6,
        nom: 'Sophie',
        prenom: 'Laurent',
        email: 'sophie.laurent@example.com',
        role: 'User'
      }
    ];
  }

  onEdit(user: User) {
    console.log('Edit user:', user);
  }

  onDelete(user: User) {
    console.log('Delete user:', user);
  }
}
