import { Artist } from './artist.model';
import { Ticket } from './ticket.model';

export interface Event {
  eventId?: number;
  label: string;
  description: string;
  date: string;
  place: string;
  price: number;
  capacity: number;
  status: string;
  popularity: number;
  artist?: Artist;
  tickets?: Ticket[];
  imageUrl?: string;
  vipCode: string; // Stripe price ID for payment processing
}