import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Ticket } from '../models/ticket.model';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  generateInvoice(ticket: Ticket, event: Event, customerInfo: any): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
    });

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.rect(15, 15, 180, 267);

    const faviconPath = 'public/favicon.ico';
    try {
      doc.addImage(faviconPath, 'ICO', 40, 30, 15, 15);
    } catch (error) {
      console.warn('Could not load favicon, continuing without logo');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(32);
    doc.setTextColor(44, 51, 66);
    doc.text('Ticketio', 60, 42);

    doc.setFontSize(24);
    doc.text('INVOICE', 40, 70);

    doc.setDrawColor(200, 200, 200);
    doc.line(40, 80, 170, 80);

    doc.setFontSize(14);
    doc.setTextColor(44, 51, 66);

    const startY = 100;
    const labelX = 40;
    const valueX = 100;
    const lineHeight = 12;

    const addRow = (label: string, value: string, y: number) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, labelX, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, valueX, y);
    };

    addRow('Ticket Code:', ticket.code, startY);
    addRow('Event', event.label, startY + lineHeight * 1);
    addRow('Date', event.date, startY + lineHeight * 2);
    addRow('Location', event.place, startY + lineHeight * 3);
    addRow('Seat', ticket.noPlace, startY + lineHeight * 4);
    addRow('Price', `${event.price}€`, startY + lineHeight * 5);
    addRow('Customer:', `${customerInfo.firstName} ${customerInfo.lastName}`, startY + lineHeight * 6);
    addRow('Email', customerInfo.email, startY + lineHeight * 7);
    addRow('Purchase Date', ticket.datePurchased, startY + lineHeight * 8);

    doc.line(40, 240, 170, 240);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your purchase!', 40, 255);
    doc.text('Ticketio - Your Event Ticket Platform', 40, 265);

    doc.save(`ticketio-invoice-${ticket.code}.pdf`);
  }
} 