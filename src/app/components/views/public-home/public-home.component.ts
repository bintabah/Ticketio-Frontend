import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { TicketService } from '../../../services/ticket.service';
import { Event } from '../../../models/event.model';
import { Ticket } from '../../../models/ticket.model';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

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
  private tickets: Ticket[] = [];

  constructor(
    private eventService: EventService,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    this.loadEventsAndTickets();
  }

  loadEventsAndTickets() {
    // Use forkJoin to fetch both events and tickets in parallel
    forkJoin({
      events: this.eventService.getEvents(),
      tickets: this.ticketService.getTickets()
    }).subscribe({
      next: (result) => {
        this.tickets = result.tickets;
        this.popularEvents = result.events
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 6)
          .map(event => ({
            ...event,
            imageUrl: this.getRandomConcertImage()
          }));
      },
      error: (error: Error) => {
        console.error('Error loading data:', error);
      }
    });
  }

  calculateRemainingTickets(event: Event): number {
    const soldTickets = this.tickets.filter(ticket => ticket.eventId === event.eventId).length;
    return event.capacity - soldTickets;
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
} 