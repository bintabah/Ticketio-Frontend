import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

interface CreateCheckoutSessionResponse {
  sessionId: string;
}

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise = loadStripe(environment.stripePublicKey);

  constructor(private http: HttpClient) {}

  async createPaymentSession(eventId: number, customerInfo: any) {
    try {
      const stripe = await this.stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Create a checkout session on your backend
      const response = await firstValueFrom(
        this.http.post<CreateCheckoutSessionResponse>(
          `${environment.apiUrl}/payments/create-checkout-session`,
          {
            eventId,
            customerInfo
          }
        )
      );

      const result = await stripe.redirectToCheckout({
        sessionId: response.sessionId
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return { success: true };
    } catch (error) {
      console.error('Error creating payment session:', error);
      throw error;
    }
  }
} 