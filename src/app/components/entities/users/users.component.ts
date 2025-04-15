import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BaseEntityLayoutComponent } from '../../shared/base-entity-layout/base-entity-layout.component';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    BaseEntityLayoutComponent
  ],
  template: `
    <app-base-entity-layout
      title="Users"
      [contentTemplate]="contentTemplate">
    </app-base-entity-layout>

    <ng-template #contentTemplate>
      <p-table [value]="users" styleClass="p-datatable-sm">
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 5%">ID</th>
            <th style="width: 15%">Name</th>
            <th style="width: 15%">First Name</th>
            <th style="width: 20%">Email</th>
            <th style="width: 15%">Contact</th>
            <th style="width: 15%">Role</th>
            <th style="width: 15%">Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-user>
          <tr>
            <td>{{user.userId}}</td>
            <td>{{user.name}}</td>
            <td>{{user.firstName}}</td>
            <td>{{user.email}}</td>
            <td>{{user.contact}}</td>
            <td>{{user.role}}</td>
            <td>
              <div class="flex gap-2">
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" (click)="onEdit(user)"></button>
                <button pButton icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" (click)="onDelete(user)"></button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </ng-template>
  `
})
export class UsersComponent implements OnInit {
  @ViewChild('contentTemplate') contentTemplate!: TemplateRef<any>;
  
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  onEdit(user: User) {
    console.log('Edit user:', user);
    // Implement edit logic
  }

  onDelete(user: User) {
    console.log('Delete user:', user);
    // Implement delete logic
  }
} 