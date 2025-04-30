import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-home',
  templateUrl: './public-home.component.html',
  styleUrls: ['./public-home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PublicHomeComponent {
  searchQuery: string = '';

  onSearch() {
    // TODO: Implement search functionality
    console.log('Searching for:', this.searchQuery);
  }
} 