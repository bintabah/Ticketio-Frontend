import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { TicketService } from '../../../services/ticket.service';
import { CartService } from '../../../services/cart.service';
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
  filteredEvents: Event[] = [];
  cartCount: number = 0;
  private readonly thumbnailCount = 5;
  private readonly imageWidth = 400;
  private readonly imageHeight = 300;
  private tickets: Ticket[] = [];
  private allEvents: Event[] = [];

  constructor(
    private eventService: EventService,
    private ticketService: TicketService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadEventsAndTickets();
    this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.length;
    });
  }

  loadEventsAndTickets() {
    forkJoin({
      events: this.eventService.getEvents(),
      tickets: this.ticketService.getTickets()
    }).subscribe({
      next: (result) => {
        this.tickets = result.tickets;
        this.allEvents = result.events.map(event => ({
          ...event,
          imageUrl: this.getRandomConcertImage()
        }));
        this.filteredEvents = [...this.allEvents];
        this.popularEvents = this.allEvents
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 6);
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
    if (!this.searchQuery.trim()) {
      this.filteredEvents = [...this.allEvents];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredEvents = this.allEvents.filter(event => 
      event.label.toLowerCase().includes(query) ||
      event.place.toLowerCase().includes(query) ||
      event.date.toLowerCase().includes(query)
    );
  }

  getSectionTitle(): string {
    if (!this.searchQuery.trim()) {
      return 'Concerts à venir !';
    }
    return this.filteredEvents.length > 0 
      ? `Résultats pour "${this.searchQuery}"` 
      : `Aucun résultat pour "${this.searchQuery}"`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  addToCart(event: Event) {
    this.cartService.addToCart(event);
  }
} 