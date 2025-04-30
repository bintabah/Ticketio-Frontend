import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    RouterLink
  ],
  providers: [MessageService],
  template: `
    <div class="login-container">
      <p-toast></p-toast>
      
      <div class="login-card">
        <div class="login-header">
          <h1><a routerLink="/">Ticketio</a></h1>
        </div>
        
        <div class="login-content">
          <h2>Connectez-vous pour continuer</h2>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-field">
              <label for="email">Email</label>
              <input id="email" type="email" pInputText formControlName="email" placeholder="Votre adresse email" />
              <small *ngIf="f['email'].invalid && (f['email'].dirty || f['email'].touched)" class="error-message">
                <div *ngIf="f['email'].errors?.['required']">Email requis</div>
                <div *ngIf="f['email'].errors?.['email']">Email invalide</div>
              </small>
            </div>
            
            <div class="form-field">
              <label for="password">Mot de passe</label>
              <p-password id="password" formControlName="password" [toggleMask]="true" [feedback]="false" 
                styleClass="w-full" placeholder="Votre mot de passe"></p-password>
              <small *ngIf="f['password'].invalid && (f['password'].dirty || f['password'].touched)" class="error-message">
                <div *ngIf="f['password'].errors?.['required']">Mot de passe requis</div>
              </small>
            </div>
            
            <div class="login-button">
              <button type="submit" [disabled]="loginForm.invalid || loading">
                SE CONNECTER
                <span class="loader" *ngIf="loading"></span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
      background: linear-gradient(to right, #f5f7fa, #eef2f7);
    }

    .login-card {
      width: 400px;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .login-header {
      background-color: #1e293b;
      padding: 20px;
      text-align: center;
    }
    
    .login-header h1 {
      margin: 0;
      font-size: 24px;
    }

    .login-header h1 a {
      color: white;
      text-decoration: none;
      transition: opacity 0.2s;
    }

    .login-header h1 a:hover {
      opacity: 0.9;
    }
    
    .login-content {
      padding: 30px;
    }
    
    .login-content h2 {
      margin-top: 0;
      margin-bottom: 24px;
      font-size: 18px;
      color: #495057;
      text-align: center;
    }
    
    .form-field {
      margin-bottom: 20px;
    }
    
    .form-field label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #495057;
    }
    
    .form-field input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 3px;
    }
    
    .error-message {
      color: #e74c3c;
      font-size: 12px;
      margin-top: 5px;
      display: block;
    }
    
    .forgot-password {
      text-align: right;
      margin-bottom: 20px;
    }
    
    .forgot-password a {
      color: #3498db;
      text-decoration: none;
      font-size: 14px;
      cursor: pointer;
    }
    
    .forgot-password a:hover {
      text-decoration: underline;
    }
    
    .login-button button {
      width: 100%;
      padding: 12px;
      background-color: #1e293b;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-weight: bold;
      position: relative;
      transition: background-color 0.2s;
    }
    
    .login-button button:disabled {
      background-color: #a0a0a0;
      cursor: not-allowed;
    }
    
    .login-button button:not(:disabled):hover {
      background-color: #2d3b4e;
    }
    
    .loader {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s linear infinite;
      margin-left: 8px;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    /* Adaptation PrimeNG */
    :host ::ng-deep .p-password {
      width: 100%;
    }
    
    :host ::ng-deep .p-password-input {
      width: 100%;
      padding: 10px;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur de connexion',
            detail: error.message || 'Identifiants incorrects'
          });
          this.loading = false;
        }
      });
  }
}