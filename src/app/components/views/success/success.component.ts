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
      console.log('Creating ticket for event:', eventId);
      this.createTicket(Number(eventId));
    } else {
      console.error('No event ID provided in URL');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No event ID provided'
      });
      this.router.navigate(['/']);
    }
  }

  private createTicket(eventId: number) {
    console.log('Generating ticket data for event:', eventId);
    const ticket: Ticket = {
      noPlace: this.generateSeatNumber(),
      code: this.generateTicketCode(),
      status: 'ACTIVE',
      datePurchased: new Date(),
      eventId: eventId,
      userId: 1 // You might want to get this from the current user
    };

    console.log('Sending ticket creation request:', ticket);
    this.ticketService.createTicket(ticket).subscribe({
      next: (response) => {
        console.log('Ticket created successfully:', response);
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
        let errorMessage = 'Failed to create ticket. Please contact support.';
        
        if (error.status === 404) {
          errorMessage = 'Event not found. Please contact support.';
        } else if (error.status === 400) {
          errorMessage = 'Invalid ticket data. Please contact support.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later or contact support.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 5000
        });
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 5000);
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