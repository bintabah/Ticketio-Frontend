export interface Ticket {
  ticketId: number;
  noPlace: string;
  code: string;
  status: string;
  datePurchased: Date;
  eventId: number;
  userId: number;
}