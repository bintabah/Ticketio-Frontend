import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<Event[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() {}

  addToCart(event: Event) {
    const currentItems = this.cartItems.value;
    this.cartItems.next([...currentItems, event]);
  }

  removeFromCart(event: Event) {
    const currentItems = this.cartItems.value;
    const index = currentItems.findIndex(item => item.eventId === event.eventId);
    if (index > -1) {
      currentItems.splice(index, 1);
      this.cartItems.next([...currentItems]);
    }
  }

  getCartCount(): number {
    return this.cartItems.value.length;
  }

  clearCart() {
    this.cartItems.next([]);
  }
} 