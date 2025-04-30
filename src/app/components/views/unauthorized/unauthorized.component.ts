import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink],
  template: `
    <div class="flex flex-column align-items-center justify-content-center min-h-screen bg-gray-50">
      <div class="text-center p-5">
        <i class="pi pi-lock text-6xl text-pink-500 mb-4"></i>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Accès non autorisé</h1>
        <p class="text-xl text-gray-600 mb-5">Vous n'avez pas les droits nécessaires pour accéder à cette page.</p>
        <button pButton type="button" label="Retour à l'accueil" routerLink="/"></button>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {}