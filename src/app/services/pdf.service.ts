import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Ticket } from '../models/ticket.model';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  generateInvoice(ticket: Ticket, event: Event, customerInfo: any): void {
    const doc = new jsPDF();
    
    // Add header without logo
    doc.setFontSize(20);
    doc.text('Ticketio', 15, 30);
    doc.setFontSize(12);
    doc.text('Invoice', 15, 40);

    // Add ticket details
    doc.setFontSize(10);
    doc.text(`Ticket Code: ${ticket.code}`, 15, 60);
    doc.text(`Event: ${event.label}`, 15, 70);
    doc.text(`Date: ${event.date}`, 15, 80);
    doc.text(`Location: ${event.place}`, 15, 90);
    doc.text(`Seat: ${ticket.noPlace}`, 15, 100);
    doc.text(`Price: ${event.price}€`, 15, 110);

    // Add customer details
    doc.text(`Customer: ${customerInfo.firstName} ${customerInfo.lastName}`, 15, 130);
    doc.text(`Email: ${customerInfo.email}`, 15, 140);

    // Add purchase date
    doc.text(`Purchase Date: ${ticket.datePurchased}`, 15, 160);

    // Add footer
    doc.setFontSize(8);
    doc.text('Thank you for your purchase!', 15, 280);
    doc.text('Ticketio - Your Event Ticket Platform', 15, 285);

    // Save the PDF
    doc.save(`ticketio-invoice-${ticket.code}.pdf`);
  }
} 