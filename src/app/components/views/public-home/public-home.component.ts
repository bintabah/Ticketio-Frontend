import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/event.model';

@Component({
  selector: 'app-public-home',
  templateUrl: './public-home.component.html',
  styleUrls: ['./public-home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class PublicHomeComponent implements OnInit {
  searchQuery: string = '';
  popularEvents: Event[] = [];
  private readonly thumbnailCount = 5;
  private readonly imageWidth = 400;
  private readonly imageHeight = 300;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadPopularEvents();
  }

  loadPopularEvents() {
    this.eventService.getEvents().subscribe({
      next: (events: Event[]) => {
        this.popularEvents = events
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 6)
          .map(event => ({
            ...event,
            imageUrl: this.getRandomConcertImage()
          }));
      },
      error: (error: Error) => {
        console.error('Error loading popular events:', error);
      }
    });
  }

  private getRandomConcertImage(): string {
    const randomIndex = Math.floor(Math.random() * this.thumbnailCount) + 1;
    return `https://picsum.photos/seed/concert${randomIndex}/${this.imageWidth}/${this.imageHeight}`;
  }

  onSearch() {
    // TODO: Implement search functionality
    console.log('Searching for:', this.searchQuery);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  calculateRemainingTickets(event: Event): number {
    const soldTickets = event.tickets?.length || 0;
    return event.capacity - soldTickets;
  }
} 