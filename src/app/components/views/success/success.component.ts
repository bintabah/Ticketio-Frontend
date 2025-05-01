import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../services/ticket.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Ticket } from '../../../models/ticket.model';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
  standalone: true,
  imports: [CommonModule, ToastModule],
  providers: [MessageService]
})
export class SuccessComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.queryParamMap.get('eventId');
    if (eventId) {
      this.createTicket(Number(eventId));
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No event ID provided'
      });
      this.router.navigate(['/']);
    }
  }

  private createTicket(eventId: number) {
    const ticket: Ticket = {
      ticketId: 0, // Will be set by the backend
      noPlace: this.generateSeatNumber(),
      code: this.generateTicketCode(),
      status: 'ACTIVE',
      datePurchased: new Date(),
      eventId: eventId,
      userId: 1 // You might want to get this from the current user
    };

    this.ticketService.createTicket(ticket).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Your ticket has been created successfully!'
        });
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (error) => {
        console.error('Error creating ticket:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create ticket. Please contact support.'
        });
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      }
    });
  }

  private generateSeatNumber(): string {
    const row = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    const seat = Math.floor(Math.random() * 100) + 1;
    return `${row}${seat}`;
  }

  private generateTicketCode(): string {
    return Math.random().toString(36).substring(2, 15).toUpperCase();
  }
} 