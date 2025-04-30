import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, forkJoin } from 'rxjs';

interface Event {
  eventId: number;
  label: string;
  price: number;
}

interface Ticket {
  ticketId: number;
  eventId: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  getTotalSales(): Observable<number> {
    return forkJoin({
      tickets: this.http.get<Ticket[]>(`${this.apiUrl}/tickets`),
      events: this.http.get<Event[]>(`${this.apiUrl}/events`)
    }).pipe(
      tap(data => {
        console.log('Tickets:', data.tickets);
        console.log('Events:', data.events);
      }),
      map(({ tickets, events }) => {
        const eventPrices = new Map(
          events.map(event => [event.eventId, event.price])
        );

        const total = tickets.reduce((sum, ticket) => {
          const price = eventPrices.get(ticket.eventId) || 0;
          console.log(`Ticket ${ticket.ticketId} (Event ${ticket.eventId}) price:`, price);
          return sum + price;
        }, 0);

        console.log('Final calculation:', {
          numberOfTickets: tickets.length,
          total: total
        });

        return total;
      })
    );
  }
} 