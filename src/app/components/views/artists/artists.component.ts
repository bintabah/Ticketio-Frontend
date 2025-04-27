import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { BaseEntityLayoutComponent } from '../../shared/base-entity-layout/base-entity-layout.component';
import { ArtistService } from '../../../services/artist.service';
import { Artist } from '../../../models/artist.model';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    RouterLink, 
    BaseEntityLayoutComponent,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <app-base-entity-layout
      title="Artists"
      [contentTemplate]="contentTemplate">
    </app-base-entity-layout>

    <ng-template #contentTemplate>
      <p-toast></p-toast>
      <p-confirmDialog header="Confirmation" 
                      icon="pi pi-exclamation-triangle"
                      acceptLabel="Oui"
                      rejectLabel="Non"></p-confirmDialog>
      
      <p-table [value]="artists" styleClass="p-datatable-sm">
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 5%">ID</th>
            <th style="width: 40%">Nom</th>
            <th style="width: 35%">Genre</th>
            <th style="width: 20%">Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-artist>
          <tr>
            <td>{{artist.artistId}}</td>
            <td>{{artist.name}}</td>
            <td>{{artist.genre}}</td>
            <td>
              <div class="flex gap-2">
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" (click)="onEdit(artist)"></button>
                <button pButton icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" (click)="onDelete(artist)"></button>
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
export class ArtistsComponent implements OnInit {
  @ViewChild('contentTemplate') contentTemplate!: TemplateRef<any>;

  artists: Artist[] = [];

  constructor(
    private artistService: ArtistService, 
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists(): void {
    this.artistService.getArtists().subscribe({
      next: (data) => {
        this.artists = data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des artistes:', error);
      }
    });
  }

  onEdit(artist: Artist): void {
    this.router.navigate(['/artists/edit', artist.artistId]);
  }

  onDelete(artist: Artist): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer l'artiste "${artist.name}" ?`,
      accept: () => {
        this.artistService.deleteArtist(artist.artistId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `L'artiste "${artist.name}" a été supprimé`
            });
            this.loadArtists(); // Recharger la liste après suppression
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
