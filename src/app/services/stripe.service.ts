import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Event } from '../models/event.model';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise = loadStripe(environment.stripePublicKey);

  constructor(private http: HttpClient, private eventService: EventService) {}

  async createPaymentSession(eventId: number, customerInfo: any): Promise<any> {
    console.log('Creating payment session for event:', eventId, 'with customer info:', customerInfo);
    
    try {
      const event = await firstValueFrom(this.eventService.getEvent(eventId));
      if (!event) {
        throw new Error('Event not found');
      }
      
      const stripe = await this.loadStripe();
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{
          price: 'price_1LBoFRGOeuivamSHGciHFnHZ',
          quantity: 1
        }],
        mode: 'payment',
        successUrl: `${window.location.origin}/success?eventId=${eventId}`,
        cancelUrl: `${window.location.origin}/checkout?eventId=${eventId}`,
        customerEmail: customerInfo.email,
        clientReferenceId: eventId.toString()
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Detailed payment session error:', error);
      throw error;
    }
  }

  private async loadStripe() {
    const stripe = await this.stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }
    return stripe;
  }
}