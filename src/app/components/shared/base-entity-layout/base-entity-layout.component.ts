import { Component, Input, Type, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-base-entity-layout',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule
  ],
  template: `
    <div class="entity-wrapper">
      <div class="entity-header">
        <h2>{{ title }}</h2>
        <div class="entity-actions">
          <button pButton icon="pi pi-plus" label="Add New" (click)="onAdd()" class="p-button-primary"></button>
        </div>
      </div>

      <div class="entity-content">
        <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
      </div>
    </div>
  `,
  styles: [`
    .entity-wrapper {
      padding: 1.5rem;
      background-color: #ffffff;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .entity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .entity-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .entity-actions {
      display: flex;
      gap: 1rem;
    }

    .entity-content {
      margin-top: 1rem;
    }
  `]
})
export class BaseEntityLayoutComponent {
  @Input() title!: string;
  @Input() contentTemplate!: any;

  onAdd() {
    // This will be implemented by child components
    console.log('Add new entity');
  }
} 