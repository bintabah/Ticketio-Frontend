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
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BaseEntityLayoutComponent } from '../../shared/base-entity-layout/base-entity-layout.component';

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
    BadgeModule,
    AccordionModule,
    AvatarModule,
    BaseEntityLayoutComponent
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <app-base-entity-layout
      title="Tickets"
      [contentTemplate]="contentTemplate"
      [showAddButton]="false">
    </app-base-entity-layout>

    <ng-template #contentTemplate>
      <p-toast></p-toast>
      <p-confirmDialog header="Confirmation" 
                      icon="pi pi-exclamation-triangle"
                      acceptLabel="Oui"
                      rejectLabel="Non"></p-confirmDialog>
      
      <div *ngIf="loading" class="flex justify-content-center my-4">
        <p-progressSpinner strokeWidth="4" animationDuration=".5s"></p-progressSpinner>
      </div>
      
      <div *ngIf="!loading && ticketGroups.length === 0" class="text-center py-6 surface-card border-round shadow-1">
        <i class="pi pi-ticket text-5xl text-500 mb-4"></i>
        <p class="text-xl text-700">Aucun ticket trouvé.</p>
      </div>
      
      <p-accordion [multiple]="true" *ngIf="!loading && ticketGroups.length > 0">
        <p-accordionTab *ngFor="let group of ticketGroups">
          <ng-template pTemplate="header">
            <div class="flex align-items-center gap-3 w-full">
              <i class="pi pi-calendar-event text-xl text-primary"></i>
              <div class="flex-grow-1">
                <span class="font-bold text-900">{{ group.event.label }}</span>
                <div class="flex align-items-center text-sm text-700 mt-1">
                  <i class="pi pi-calendar mr-2"></i>
                  <span>{{ group.event.date | date:'dd/MM/yyyy' }}</span>
                  <i class="pi pi-map-marker ml-4 mr-2"></i>
                  <span>{{ group.event.place }}</span>
                </div>
              </div>
              <p-badge [value]="group.tickets.length.toString()" severity="info"></p-badge>
            </div>
          </ng-template>
          
          <div class="p-2">
            <p-table [value]="group.tickets" styleClass="p-datatable-sm"
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
                    <span class="text-sm font-semibold">{{ ticket.ticketId }}</span>
                  </td>
                  <td>
                    <div class="flex align-items-center">
                      <span class="font-medium">{{ ticket.noplace }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="flex align-items-center">
                      <i class="pi pi-ticket mr-2 text-primary"></i>
                      <code class="bg-gray-100 px-2 py-1 border-round text-900">{{ ticket.code }}</code>
                    </div>
                  </td>
                  <td>
                    <p-tag [severity]="getStatusSeverity(ticket.status)" [value]="ticket.status"></p-tag>
                  </td>
                  <td>
                    <span class="text-700">{{ ticket.datePurchased | date:'dd/MM/yyyy' }}</span>
                  </td>
                  <td>
                    <div class="flex gap-2">
                      <button pButton icon="pi pi-trash" 
                              class="p-button-rounded p-button-text p-button-danger p-button-sm"
                              (click)="onDelete(ticket)"></button>
                    </div>
                  </td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="6" class="text-center py-4">
                    <i class="pi pi-ticket text-500 text-3xl mb-2"></i>
                    <p class="text-700">Aucun ticket pour cet événement</p>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </p-accordionTab>
      </p-accordion>
    </ng-template>
  `,
  styles: [`
    :host ::ng-deep {
      .p-accordion {
        .p-accordion-header-link {
          padding: 1.25rem;
          background: var(--surface-card);
          border: 1px solid var(--surface-border);
          border-radius: 6px;
          margin-bottom: 0.5rem;
          
          &:not(.p-disabled):hover {
            background: var(--surface-hover);
          }
          
          &:focus {
            box-shadow: inset 0 0 0 1px var(--primary-color);
          }
        }
        
        .p-accordion-content {
          padding: 1.25rem;
          background: var(--surface-card);
          border: 1px solid var(--surface-border);
          border-top: 0;
          border-radius: 0 0 6px 6px;
          margin-bottom: 0.5rem;
        }
      }
      
      .p-datatable {
        .p-datatable-thead > tr > th {
          background: var(--surface-ground);
          color: var(--text-color-secondary);
          font-weight: 600;
          padding: 0.75rem 1rem;
        }
        
        .p-datatable-tbody > tr > td {
          padding: 0.75rem 1rem;
        }
      }
      
      .p-tag {
        min-width: 7rem;
        justify-content: center;
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
      'DRAFT': 'secondary',
      'ACTIVE': 'success',
      'CLOSED': 'danger',
      'CANCELLED': 'warn'
    };
    
    return statusMap[status] || 'info';
  }

  onDelete(ticket: Ticket): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le ticket <strong>${ticket.noPlace} - ${ticket.code}</strong> ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        if (ticket.ticketId) {
          this.ticketService.deleteTicket(ticket.ticketId).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: `Le ticket "${ticket.noPlace} - ${ticket.code}" a été supprimé`
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
      }
    });
  }
}
