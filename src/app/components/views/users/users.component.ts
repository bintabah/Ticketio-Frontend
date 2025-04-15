import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BaseEntityLayoutComponent } from '../../shared/base-entity-layout/base-entity-layout.component';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { UsersFormComponent } from '../../forms/users/users.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    BaseEntityLayoutComponent,
    UsersFormComponent,
    DialogModule
  ],
  template: `
    <app-base-entity-layout
      title="Users"
      [contentTemplate]="contentTemplate"
      (add)="onCreate()">
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

      <p-dialog 
        [(visible)]="displayEditDialog" 
        [style]="{width: '50vw'}" 
        [modal]="true"
        [draggable]="false"
        [resizable]="false"
        [header]="selectedUser ? 'Modifier l\\'utilisateur' : 'Créer un utilisateur'"
        (onHide)="onDialogHide()">
        <app-users-form
          *ngIf="displayEditDialog"
          [user]="selectedUser"
          (submitForm)="onSubmit($event)"
          (cancel)="onCancel()"
        ></app-users-form>
      </p-dialog>
    </ng-template>
  `
})
export class UsersComponent implements OnInit {
  @ViewChild('contentTemplate') contentTemplate!: TemplateRef<any>;
  
  users: User[] = [];
  selectedUser: User | null = null;
  displayEditDialog = false;

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

  onCreate() {
    this.selectedUser = null; // Ensure we're in create mode
    this.displayEditDialog = true;
  }

  onEdit(user: User) {
    this.selectedUser = {...user}; // Create a copy to avoid modifying the original
    this.displayEditDialog = true;
  }

  onDelete(user: User) {
    console.log('Delete user:', user);
    // Implement delete logic
  }

  onSubmit(userData: User) {
    if (this.selectedUser) {
      // Edit mode
      this.userService.updateUser(this.selectedUser.userId, userData).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.userId === updatedUser.userId);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.displayEditDialog = false;
          this.selectedUser = null;
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    } else {
      // Create mode
      this.userService.createUser(userData).subscribe({
        next: (newUser) => {
          this.users = [...this.users, newUser]; // Add new user to the list
          this.displayEditDialog = false;
        },
        error: (error) => {
          console.error('Error creating user:', error);
        }
      });
    }
  }

  onCancel() {
    this.displayEditDialog = false;
    this.selectedUser = null;
  }

  onDialogHide() {
    this.selectedUser = null;
  }
} 