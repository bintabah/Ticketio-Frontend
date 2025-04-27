import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BaseEntityLayoutComponent } from '../../shared/base-entity-layout/base-entity-layout.component';
import { Event } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    BaseEntityLayoutComponent,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <app-base-entity-layout
      title="Events"
      [contentTemplate]="contentTemplate">
    </app-base-entity-layout>

    <ng-template #contentTemplate>
      <p-toast></p-toast>
      <p-confirmDialog header="Confirmation" 
                      icon="pi pi-exclamation-triangle"
                      acceptLabel="Oui"
                      rejectLabel="Non"></p-confirmDialog>
      
      <p-table [value]="events" styleClass="p-datatable-sm">
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 5%">ID</th>
            <th style="width: 15%">Label</th>
            <th style="width: 10%">Date</th>
            <th style="width: 15%">Place</th>
            <th style="width: 10%">Price</th>
            <th style="width: 10%">Capacity</th>
            <th style="width: 10%">Status</th>
            <th style="width: 10%">Popularity</th>
            <th style="width: 15%">Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-event>
          <tr>
            <td>{{event.eventId}}</td>
            <td>{{event.label}}</td>
            <td>{{event.date | date:'short'}}</td>
            <td>{{event.place}}</td>
            <td>{{event.price | currency}}</td>
            <td>{{event.capacity}}</td>
            <td>
              <span [class]="getStatusClass(event.status)">
                {{event.status}}
              </span>
            </td>
            <td>{{event.popularity}}</td>
            <td>
              <div class="flex gap-2">
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" (click)="onEdit(event)"></button>
                <button pButton icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" (click)="onDelete(event)"></button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </ng-template>
  `,
  styles: [`
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-align: center;
      border: 1px solid transparent;
    }
    
    .status-active {
      background-color: #dcfce7;
      color: #166534;
      border-color: #86efac;
    }
    
    .status-cancelled {
      background-color: #fee2e2;
      color: #991b1b;
      border-color: #fca5a5;
    }
    
    .status-soldout {
      background-color: #fef3c7;
      color: #92400e;
      border-color: #fcd34d;
    }
    
    .status-upcoming {
      background-color: #dbeafe;
      color: #1e40af;
      border-color: #93c5fd;
    }
    
    .status-en-cours {
      background-color: #fff7ed;
      color: #c2410c;
      border-color: #fdba74;
    }
  `]
})
export class EventsComponent implements OnInit {
  @ViewChild('contentTemplate') contentTemplate!: TemplateRef<any>;
  
  events: Event[] = [];

  constructor(
    private eventService: EventService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (error) => {
        console.error('Error loading events:', error);
      }
    });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Active': 'status-badge status-active',
      'Cancelled': 'status-badge status-cancelled',
      'Soldout': 'status-badge status-soldout',
      'Upcoming': 'status-badge status-upcoming',
      'En cours': 'status-badge status-en-cours'
    };
    
    return statusMap[status] || 'status-badge';
  }

  onEdit(event: Event) {
    console.log('Edit event:', event);
    // Implement edit logic
  }

  onDelete(event: Event) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer l'événement "${event.label}" ?`,
      accept: () => {
        this.eventService.deleteEvent(event.eventId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `L'événement "${event.label}" a été supprimé`
            });
            this.loadEvents(); // Recharger la liste des événements
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
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