import { Artist } from './artist.model';
import { Ticket } from './ticket.model';

export interface Event {
  eventId?: number;
  label: string;
  date: string;
  place: string;
  price: number;
  description: string;
  capacity: number;
  status: string;
  popularity: number;
  artist: Artist | null;
  tickets?: Ticket[];
} 