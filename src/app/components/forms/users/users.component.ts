import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-users-form',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule
  ]
})
export class UsersFormComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() submitForm = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  userForm: FormGroup;
  isEditMode = false;
  roleOptions = [
    { label: 'Administrateur', value: 'admin' },
    { label: 'Utilisateur', value: 'user' }
  ];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.isEditMode = true;
      this.userForm.patchValue({
        name: this.user.name,
        firstName: this.user.firstName,
        email: this.user.email,
        contact: this.user.contact,
        role: this.user.role
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      if (this.isEditMode && this.user) {
        formData.userId = this.user.userId;
      }
      this.submitForm.emit(formData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
} 