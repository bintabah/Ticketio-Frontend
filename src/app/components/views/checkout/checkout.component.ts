import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Event } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';
import { StripeService } from '../../../services/stripe.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ToastModule],
  providers: [MessageService]
})
export class CheckoutComponent implements OnInit {
  event: Event | null = null;
  customerInfo = {
    firstName: '',
    lastName: '',
    email: ''
  };
  isProcessing = false;
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private stripeService: StripeService,
    private location: Location,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Get current user info
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.currentUser = user;
        // Pre-fill the form with user info
        this.customerInfo = {
          firstName: user.firstName || '',
          lastName: user.name || '',
          email: user.email || ''
        };
      }
    });

    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getEvent(Number(eventId)).subscribe({
        next: (event) => {
          this.event = event;
        },
        error: (error) => {
          console.error('Error loading event:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to load event details'
          });
          this.router.navigate(['/']);
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  async handlePayment() {
    if (!this.event?.eventId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Event information is missing'
      });
      return;
    }

    this.isProcessing = true;
    
    try {
      console.log('Starting payment process for event:', this.event.eventId);
      await this.stripeService.createPaymentSession(
        this.event.eventId,
        this.customerInfo
      );
    } catch (error: any) {
      console.error('Payment process error:', error);
      let errorMessage = 'Unable to process payment. Please try again.';
      
      if (error.status === 404) {
        errorMessage = 'Payment endpoint not found. Please check the server configuration.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      this.messageService.add({
        severity: 'error',
        summary: 'Payment Failed',
        detail: errorMessage,
        life: 5000
      });
      this.isProcessing = false;
    }
  }
} 