import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';

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

interface TopEvent {
  eventId: number;
  label: string;
  date: Date;
  place: string;
  price: number;
  ticketsSold: number;
  revenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = environment.apiUrl;

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

  getTotalTickets(): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets`).pipe(
      map(tickets => tickets.length),
      tap(total => console.log('Total tickets:', total))
    );
  }

  getTotalUsers(): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      map(users => users.length),
      tap(total => console.log('Total users:', total))
    );
  }

  getTotalEvents(): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/events`).pipe(
      map(events => events.length),
      tap(total => console.log('Total events:', total))
    );
  }

  getTopEvents(): Observable<TopEvent[]> {
    return forkJoin({
      events: this.http.get<any[]>(`${this.apiUrl}/events`),
      tickets: this.http.get<any[]>(`${this.apiUrl}/tickets`)
    }).pipe(
      map(({ events, tickets }) => {
        // Create a map to count tickets per event
        const ticketCounts = new Map<number, number>();
        tickets.forEach(ticket => {
          const eventId = ticket.eventId;
          ticketCounts.set(eventId, (ticketCounts.get(eventId) || 0) + 1);
        });

        // Transform events with ticket counts and revenue
        const topEvents = events.map(event => ({
          eventId: event.eventId,
          label: event.label,
          date: new Date(event.date),
          place: event.place,
          price: event.price,
          ticketsSold: ticketCounts.get(event.eventId) || 0,
          revenue: (ticketCounts.get(event.eventId) || 0) * event.price
        }));

        // Sort by tickets sold in descending order
        return topEvents.sort((a, b) => b.ticketsSold - a.ticketsSold).slice(0, 5);
      }),
      tap(topEvents => console.log('Top events:', topEvents))
    );
  }
} 