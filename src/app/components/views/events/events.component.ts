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
import { DialogModule } from 'primeng/dialog';
import { EventsFormComponent } from '../../forms/events/events.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    BaseEntityLayoutComponent,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    EventsFormComponent
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <app-base-entity-layout
      title="Events"
      [contentTemplate]="contentTemplate"
      (add)="onCreate()">
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

      <p-dialog 
        [(visible)]="displayEditDialog" 
        [style]="{width: '50vw'}" 
        [modal]="true"
        [draggable]="false"
        [resizable]="false"
        [header]="dialogHeader"
        (onHide)="onDialogHide()">
        <app-events-form
          *ngIf="displayEditDialog"
          [event]="selectedEvent"
          (submitForm)="onSubmit($event)"
          (cancel)="onCancel()"
        ></app-events-form>
      </p-dialog>
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
    
    .status-draft {
      background-color: #f3f4f6;
      color: #4b5563;
      border-color: #d1d5db;
    }
    
    .status-active {
      background-color: #dcfce7;
      color: #166534;
      border-color: #86efac;
    }
    
    .status-closed {
      background-color: #fee2e2;
      color: #991b1b;
      border-color: #fca5a5;
    }
    
    .status-cancelled {
      background-color: #fef3c7;
      color: #92400e;
      border-color: #fcd34d;
    }
  `]
})
export class EventsComponent implements OnInit {
  @ViewChild('contentTemplate') contentTemplate!: TemplateRef<any>;
  
  events: Event[] = [];
  displayEditDialog = false;
  selectedEvent: Event | undefined;
  dialogHeader = '';

  constructor(
    private eventService: EventService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe({
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
      'DRAFT': 'status-badge status-draft',
      'ACTIVE': 'status-badge status-active',
      'CLOSED': 'status-badge status-closed',
      'CANCELLED': 'status-badge status-cancelled'
    };
    
    return statusMap[status] || 'status-badge status-draft';
  }

  onCreate() {
    this.selectedEvent = undefined;
    this.dialogHeader = 'Créer un événement';
    this.displayEditDialog = true;
  }

  onEdit(event: Event) {
    this.selectedEvent = { ...event };
    this.dialogHeader = 'Modifier l\'événement';
    this.displayEditDialog = true;
  }

  onSubmit(event: Event) {
    if (event.eventId) {
      this.eventService.updateEvent(event).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `L'événement "${event.label}" a été modifié`
          });
          this.loadEvents();
          this.displayEditDialog = false;
        },
        error: (error) => {
          console.error('Error updating event:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'La modification a échoué'
          });
        }
      });
    } else {
      this.eventService.createEvent(event).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `L'événement "${event.label}" a été créé`
          });
          this.loadEvents();
          this.displayEditDialog = false;
        },
        error: (error) => {
          console.error('Error creating event:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'La création a échoué'
          });
        }
      });
    }
  }

  onCancel() {
    this.displayEditDialog = false;
  }

  onDialogHide() {
    this.selectedEvent = undefined;
  }

  onDelete(event: Event) {
    this.confirmationService.confirm({
      message: `L'événement <strong>${event.label}</strong> pourrait avoir des tickets. <br> Ils seront également supprimés. <br> <br> Êtes-vous sûr de vouloir le supprimer ?`,
      accept: () => {
        this.eventService.deleteEvent(event.eventId!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `L'événement "${event.label}" a été supprimé`
            });
            this.loadEvents();
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