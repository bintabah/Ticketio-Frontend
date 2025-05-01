import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../services/ticket.service';
import { UserService } from '../../../services/user.service';
import { EventService } from '../../../services/event.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Ticket } from '../../../models/ticket.model';
import { User } from '../../../models/user.model';
import { Event } from '../../../models/event.model';

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
    private userService: UserService,
    private eventService: EventService,
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
    this.eventService.getEvent(eventId).subscribe({
      next: (event) => {
        if (!event) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Event not found'
          });
          this.router.navigate(['/']);
          return;
        }

        this.userService.getUsers().subscribe({
          next: (users) => {
            if (users.length === 0) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No users found in database'
              });
              this.router.navigate(['/']);
              return;
            }

            const randomUser = users[Math.floor(Math.random() * users.length)];
            console.log('Selected user:', randomUser);

            this.ticketService.getTicketsByEvent(eventId).subscribe({
              next: (tickets) => {
                const remainingTickets = event.capacity - tickets.length;
                if (remainingTickets <= 0) {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No tickets available for this event'
                  });
                  this.router.navigate(['/']);
                  return;
                }

                const ticket: Ticket = {
                  noPlace: remainingTickets.toString(),
                  code: this.generateTicketCode(),
                  status: 'Valid',
                  datePurchased: new Date().toISOString().split('T')[0],
                  eventId: eventId,
                  userId: randomUser.userId
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
                    let errorMessage = 'Failed to create ticket. Please try again.';
                    
                    if (error.error?.message) {
                      errorMessage = error.error.message;
                    } else if (error.status === 404) {
                      errorMessage = 'Event not found.';
                    } else if (error.status === 400) {
                      errorMessage = 'Invalid ticket data.';
                    } else if (error.status === 500) {
                      errorMessage = 'Server error. Please try again later.';
                    }

                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: errorMessage,
                      life: 5000
                    });
                  }
                });
              },
              error: (error) => {
                console.error('Error loading tickets:', error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to load tickets for event'
                });
                this.router.navigate(['/']);
              }
            });
          },
          error: (error) => {
            console.error('Error loading users:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to load users from database'
            });
            this.router.navigate(['/']);
          }
        });
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load event details'
        });
        this.router.navigate(['/']);
      }
    });
  }

  private generateTicketCode(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `TIX-${timestamp}-${random}`.toUpperCase();
  }
} 