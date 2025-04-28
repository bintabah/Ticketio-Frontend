import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TicketService } from '../../../services/ticket.service';
import { EventService } from '../../../services/event.service';
import { Ticket } from '../../../models/ticket.model';
import { Event } from '../../../models/event.model';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';

interface TicketGroup {
  event: Event;
  tickets: Ticket[];
}

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    CardModule,
    ProgressSpinnerModule,
    TagModule,
    DividerModule,
    BadgeModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="container mx-auto p-4 bg-gray-50 pl-4 min-h-screen">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Gestion des tickets</h1>
        <p-divider></p-divider>
      </div>
      
      <p-toast></p-toast>
      <p-confirmDialog header="Confirmation" 
                      icon="pi pi-exclamation-triangle"
                      acceptLabel="Oui"
                      rejectLabel="Non"></p-confirmDialog>
      
      <div *ngIf="loading" class="flex justify-center my-12">
        <p-progressSpinner strokeWidth="4" animationDuration=".5s"></p-progressSpinner>
      </div>
      
      <div *ngIf="!loading && ticketGroups.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
        <i class="pi pi-ticket text-5xl text-gray-300 mb-4"></i>
        <p class="text-xl text-gray-500">Aucun ticket trouvé.</p>
      </div>
      
      <div *ngFor="let group of ticketGroups" class="mb-8">
        <p-card styleClass="shadow-lg">
          <ng-template pTemplate="header">
            <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white rounded-t-lg">
              <div class="flex items-center">
                <i class="pi pi-calendar-plus text-2xl mr-3"></i>
                <div>
                  <h2 class="text-2xl font-bold">{{ group.event.label }}</h2>
                  <div class="flex items-center mt-2 text-sm">
                    <i class="pi pi-calendar mr-2"></i>
                    <span>{{ group.event.date | date:'dd/MM/yyyy' }}</span>
                    <i class="pi pi-map-marker ml-4 mr-2"></i>
                    <span>{{ group.event.place }}</span>
                  </div>
                </div>
              </div>
            </div>
          </ng-template>
          
          <div class="px-2 bg-white">
            <div class="flex justify-between items-center mb-3">
              <div class="text-sm text-gray-500">
                <span class="font-medium">{{ group.tickets.length }}</span> tickets pour cet événement
              </div>
            </div>
            
            <p-table [value]="group.tickets" styleClass="p-datatable-sm p-datatable-striped"
                    [tableStyle]="{'min-width': '50rem'}" [rowHover]="true">
              <ng-template pTemplate="header">
                <tr>
                  <th style="width: 8%" class="text-center">ID</th>
                  <th style="width: 15%">No Place</th>
                  <th style="width: 25%">Code Ticket</th>
                  <th style="width: 20%">Status</th>
                  <th style="width: 15%">Date d'achat</th>
                  <th style="width: 17%">Actions</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-ticket>
                <tr>
                  <td class="text-center">
                    <span class="p-badge p-badge-info">{{ ticket.ticketId }}</span>
                  </td>
                  <td>
                    <div class="flex items-center">
                      <span class="font-medium">{{ ticket.noPlace }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="flex items-center">
                      <i class="pi pi-ticket mr-2 text-blue-500"></i>
                      <code class="bg-gray-100 px-2 py-1 rounded">{{ ticket.code }}</code>
                    </div>
                  </td>
                  <td>
                    <p-tag [severity]="getStatusSeverity(ticket.status)" [value]="ticket.status"></p-tag>
                  </td>
                  <td>
                    <span>{{ ticket.datePurchased | date:'dd/MM/yyyy' }}</span>
                  </td>
                  <td>
                    <div class="flex gap-2">
                      <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm"></button>
                      <button pButton icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger p-button-sm"
                              (click)="onDelete(ticket)"></button>
                    </div>
                  </td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="6" class="text-center py-6">
                    <i class="pi pi-ticket text-gray-300 text-3xl mb-2"></i>
                    <p>Aucun ticket pour cet événement</p>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-card .p-card-content {
        padding: 0.5rem;
      }
      
      .p-datatable .p-datatable-thead > tr > th {
        background-color: #f8fafc;
        color: #475569;
        font-weight: 600;
      }
      
      .p-card .p-card-body {
        padding-bottom: 1rem;
      }
      
      .p-tag {
        min-width: 7rem;
        justify-content: center;
      }

      /* Ajusté pour gérer l'espace par rapport au menu latéral */
      .container {
        background-color: #f9fafb;
        margin-left: 250px; /* Ajustez cette valeur selon la largeur de votre menu */
      }
    }
  `]
})
export class TicketsComponent implements OnInit {
  ticketGroups: TicketGroup[] = [];
  loading = true;

  constructor(
    private ticketService: TicketService,
    private eventService: EventService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.ticketService.getTickets().subscribe({
      next: (tickets) => {
        const eventGroups = this.groupTicketsByEvent(tickets);
        this.loadEventDetails(eventGroups);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tickets:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les tickets'
        });
      }
    });
  }

  groupTicketsByEvent(tickets: Ticket[]): Map<number, Ticket[]> {
    const eventGroups = new Map<number, Ticket[]>();
    
    for (const ticket of tickets) {
      if (!eventGroups.has(ticket.eventId)) {
        eventGroups.set(ticket.eventId, []);
      }
      eventGroups.get(ticket.eventId)!.push(ticket);
    }
    
    return eventGroups;
  }

  loadEventDetails(eventGroups: Map<number, Ticket[]>): void {
    if (eventGroups.size === 0) {
      this.ticketGroups = [];
      this.loading = false;
      return;
    }
    
    const eventIds = Array.from(eventGroups.keys());
    let loadedEvents = 0;
    this.ticketGroups = [];
    
    eventIds.forEach(eventId => {
      this.eventService.getEvent(eventId).subscribe({
        next: (event) => {
          this.ticketGroups.push({
            event,
            tickets: eventGroups.get(eventId) || []
          });
          
          loadedEvents++;
          
          if (loadedEvents === eventGroups.size) {
            this.finalizeTicketGroups();
          }
        },
        error: (error) => {
          console.error(`Erreur lors du chargement de l'événement ${eventId}:`, error);
          loadedEvents++;
          
          if (loadedEvents === eventGroups.size) {
            this.finalizeTicketGroups();
          }
        }
      });
    });
  }
  
  finalizeTicketGroups(): void {
    // Ne pas trier, garder l'ordre de chargement
    this.loading = false;
  }

  getStatusSeverity(status: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined {
    const statusMap: { [key: string]: "success" | "info" | "warn" | "danger" | "secondary" | "contrast" } = {
      'Valid': 'success',
      'Used': 'info',
      'Cancelled': 'danger',
      'En cours': 'warn' 
    };
    
    return statusMap[status] || 'info';
  }

  onDelete(ticket: Ticket): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le ticket "${ticket.code}" ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.ticketService.deleteTicket(ticket.ticketId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `Le ticket "${ticket.code}" a été supprimé`
            });
            this.loadTickets();
          },
          error: (error) => {
            console.error('Erreur lors de la suppression du ticket:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'La suppression a échoué'
            });
          }
        });
      }
    });
  }
}
