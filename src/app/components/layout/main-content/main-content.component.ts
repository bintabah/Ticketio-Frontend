import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  template: `
    <div class="main-content-wrapper">
      <div class="scrollable-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {}
