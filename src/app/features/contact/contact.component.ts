import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <h1>Contacto</h1>
        <p>Estamos aqui para ayudarte</p>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="section contact-section">
      <div class="container">
        <div class="contact-content">
          <!-- Contact Info -->
          <div class="contact-info">
            <h2>Informacion de Contacto</h2>
            <p class="intro">
              Tienes alguna pregunta o deseas mas informacion sobre nuestros
              servicios? No dudes en contactarnos.
            </p>

            <div class="info-items">
              <div class="info-item">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div class="info-content">
                  <h4>Direccion</h4>
                  <p>Calle Principal #123<br>Colonia Centro, Ciudad<br>CP 12345</p>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div class="info-content">
                  <h4>Telefono</h4>
                  <p>+1 234 567 8900</p>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div class="info-content">
                  <h4>Email</h4>
                  <p>info&#64;sunsetbeautyspa.com</p>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div class="info-content">
                  <h4>Horarios</h4>
                  <p>
                    Lun - Vie: 9:00 AM - 7:00 PM<br>
                    Sabados: 9:00 AM - 5:00 PM<br>
                    Domingos: 10:00 AM - 3:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div class="social-links">
              <h4>Siguenos</h4>
              <div class="social-icons">
                <a href="#" class="social-link" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="#" class="social-link" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="contact-form-wrapper">
            @if (!submitted()) {
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
                <h3>Envianos un mensaje</h3>

                <div class="form-group">
                  <label for="nombre">Nombre *</label>
                  <input
                    type="text"
                    id="nombre"
                    formControlName="nombre"
                    class="form-control"
                    placeholder="Tu nombre"
                  >
                  @if (showError('nombre')) {
                    <span class="form-error">El nombre es requerido</span>
                  }
                </div>

                <div class="form-group">
                  <label for="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    formControlName="email"
                    class="form-control"
                    placeholder="tu@email.com"
                  >
                  @if (showError('email')) {
                    <span class="form-error">Ingresa un email valido</span>
                  }
                </div>

                <div class="form-group">
                  <label for="telefono">Telefono (opcional)</label>
                  <input
                    type="tel"
                    id="telefono"
                    formControlName="telefono"
                    class="form-control"
                    placeholder="+1 234 567 8900"
                  >
                </div>

                <div class="form-group">
                  <label for="mensaje">Mensaje *</label>
                  <textarea
                    id="mensaje"
                    formControlName="mensaje"
                    class="form-control"
                    rows="5"
                    placeholder="Tu mensaje..."
                  ></textarea>
                  @if (showError('mensaje')) {
                    <span class="form-error">El mensaje es requerido</span>
                  }
                </div>

                <button
                  type="submit"
                  class="btn btn--primary btn--block"
                  [disabled]="isSubmitting()"
                >
                  @if (isSubmitting()) {
                    Enviando...
                  } @else {
                    Enviar Mensaje
                  }
                </button>
              </form>
            } @else {
              <div class="success-message">
                <div class="success-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3>Mensaje Enviado</h3>
                <p>Gracias por contactarnos. Te responderemos pronto.</p>
                <button
                  type="button"
                  class="btn btn--outline"
                  (click)="resetForm()"
                >
                  Enviar otro mensaje
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="map-section">
      <div class="map-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <p>Mapa de ubicacion</p>
        <span class="map-note">Integrar Google Maps aqui</span>
      </div>
    </section>
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .page-header {
      background: linear-gradient(135deg, $color-secondary 0%, darken($color-secondary, 5%) 100%);
      padding: calc($spacing-3xl + 80px) 0 $spacing-3xl;
      text-align: center;

      h1 {
        font-size: $font-size-4xl;
        margin-bottom: $spacing-md;

        @include respond-below('md') {
          font-size: $font-size-2xl;
        }
      }

      p {
        font-size: $font-size-lg;
        color: lighten($color-text, 15%);
      }
    }

    .container {
      @include container;
    }

    .contact-section {
      background-color: $color-background;
    }

    .contact-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $spacing-3xl;

      @include respond-below('lg') {
        grid-template-columns: 1fr;
      }
    }

    // Contact Info
    .contact-info {
      h2 {
        font-size: $font-size-2xl;
        margin-bottom: $spacing-md;
      }

      .intro {
        color: lighten($color-text, 20%);
        margin-bottom: $spacing-xl;
      }
    }

    .info-items {
      margin-bottom: $spacing-xl;
    }

    .info-item {
      display: flex;
      gap: $spacing-md;
      margin-bottom: $spacing-lg;

      .info-icon {
        @include flex-center;
        width: 50px;
        height: 50px;
        background-color: $color-secondary;
        border-radius: $border-radius-full;
        color: $color-primary;
        flex-shrink: 0;
      }

      .info-content {
        h4 {
          font-size: $font-size-base;
          margin-bottom: $spacing-xs;
        }

        p {
          color: lighten($color-text, 20%);
          margin: 0;
          line-height: 1.6;
        }
      }
    }

    .social-links {
      h4 {
        font-size: $font-size-base;
        margin-bottom: $spacing-md;
      }

      .social-icons {
        display: flex;
        gap: $spacing-md;
      }

      .social-link {
        @include flex-center;
        width: 44px;
        height: 44px;
        background-color: $color-secondary;
        border-radius: $border-radius-full;
        color: $color-text;
        transition: all $transition-fast;

        &:hover {
          background-color: $color-primary;
          color: $color-white;
          transform: translateY(-3px);
        }
      }
    }

    // Contact Form
    .contact-form-wrapper {
      background-color: $color-white;
      padding: $spacing-2xl;
      border-radius: $border-radius-lg;
      box-shadow: $shadow-md;

      h3 {
        font-size: $font-size-xl;
        margin-bottom: $spacing-xl;
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

      .form-error {
        color: $color-error;
        font-size: $font-size-sm;
        margin-top: $spacing-xs;
        display: block;
      }
    }

    .success-message {
      text-align: center;
      padding: $spacing-xl;

      .success-icon {
        @include flex-center;
        width: 80px;
        height: 80px;
        margin: 0 auto $spacing-lg;
        background-color: $color-success;
        border-radius: $border-radius-full;
        color: $color-white;
      }

      h3 {
        margin-bottom: $spacing-md;
      }

      p {
        color: lighten($color-text, 20%);
        margin-bottom: $spacing-lg;
      }
    }

    // Map Section
    .map-section {
      .map-placeholder {
        @include flex-center;
        flex-direction: column;
        gap: $spacing-md;
        height: 400px;
        background-color: $color-secondary;
        color: $color-primary;

        p {
          font-size: $font-size-lg;
          font-weight: $font-weight-medium;
          color: $color-text;
          margin: 0;
        }

        .map-note {
          font-size: $font-size-sm;
          color: lighten($color-text, 30%);
        }
      }
    }
  `]
})
export class ContactComponent {
  private fb = inject(FormBuilder);

  contactForm: FormGroup;
  isSubmitting = signal(false);
  submitted = signal(false);

  constructor() {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      mensaje: ['', Validators.required]
    });
  }

  showError(field: string): boolean {
    const control = this.contactForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);

      setTimeout(() => {
        this.isSubmitting.set(false);
        this.submitted.set(true);
      }, 1500);
    } else {
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  resetForm(): void {
    this.contactForm.reset();
    this.submitted.set(false);
  }
}
