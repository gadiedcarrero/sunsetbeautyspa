import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="login-container">
        <div class="login-header">
          <div class="logo">
            <span class="logo-text">Sunset</span>
            <span class="logo-accent">Beauty Spa</span>
          </div>
          <h1>Panel de Administracion</h1>
          <p>Ingresa tus credenciales para acceder</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          @if (error()) {
            <div class="alert alert-error">
              {{ error() }}
            </div>
          }

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              placeholder="tu@email.com"
              autocomplete="email"
            >
          </div>

          <div class="form-group">
            <label for="password">Contrasena</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              placeholder="Tu contrasena"
              autocomplete="current-password"
            >
          </div>

          <button
            type="submit"
            class="btn btn--primary btn--block"
            [disabled]="isLoading()"
          >
            @if (isLoading()) {
              <span class="spinner"></span>
              Ingresando...
            } @else {
              Ingresar
            }
          </button>
        </form>

        <div class="login-footer">
          <a href="/">Volver al sitio</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .login-page {
      min-height: 100vh;
      @include flex-center;
      background: linear-gradient(135deg, $color-secondary 0%, darken($color-secondary, 10%) 100%);
      padding: $spacing-xl;
    }

    .login-container {
      width: 100%;
      max-width: 400px;
      background-color: $color-white;
      padding: $spacing-2xl;
      border-radius: $border-radius-lg;
      box-shadow: $shadow-xl;
    }

    .login-header {
      text-align: center;
      margin-bottom: $spacing-xl;

      .logo {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: $spacing-lg;

        .logo-text {
          font-family: $font-heading;
          font-size: $font-size-2xl;
          font-weight: $font-weight-bold;
          color: $color-text;
        }

        .logo-accent {
          font-family: $font-heading;
          font-size: $font-size-sm;
          color: $color-primary;
          letter-spacing: 2px;
        }
      }

      h1 {
        font-size: $font-size-xl;
        margin-bottom: $spacing-sm;
      }

      p {
        color: lighten($color-text, 30%);
        margin: 0;
      }
    }

    .alert {
      padding: $spacing-md;
      border-radius: $border-radius-md;
      margin-bottom: $spacing-lg;

      &-error {
        background-color: rgba($color-error, 0.1);
        color: $color-error;
        border: 1px solid rgba($color-error, 0.3);
      }
    }

    .form-group {
      margin-bottom: $spacing-lg;

      label {
        display: block;
        margin-bottom: $spacing-xs;
        font-weight: $font-weight-medium;
      }
    }

    .form-control {
      @include input-base;
    }

    .btn {
      @include button-primary;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-sm;
      width: 100%;
      padding: $spacing-md;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba($color-white, 0.3);
      border-top-color: $color-white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .login-footer {
      text-align: center;
      margin-top: $spacing-xl;
      padding-top: $spacing-lg;
      border-top: 1px solid $color-secondary;

      a {
        color: lighten($color-text, 30%);
        text-decoration: none;
        font-size: $font-size-sm;

        &:hover {
          color: $color-primary;
        }
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.error.set('Credenciales incorrectas. Por favor, intenta de nuevo.');
        }
      });
    }
  }
}
