import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationService } from '../../core/services/reservation.service';
import { SpaServicesService } from '../../core/services/spa-services.service';
import { SpaService } from '../../core/models';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <h1>Reserva tu Cita</h1>
        <p>Completa el formulario y nos pondremos en contacto contigo</p>
      </div>
    </section>

    <!-- Reservation Form -->
    <section class="section reservation-section">
      <div class="container">
        <div class="reservation-content">
          <div class="form-container">
            @if (!submitted()) {
              <form [formGroup]="reservationForm" (ngSubmit)="onSubmit()">
                <div class="form-grid">
                  <div class="form-group">
                    <label for="nombre">Nombre completo *</label>
                    <input
                      type="text"
                      id="nombre"
                      formControlName="nombre"
                      class="form-control"
                      placeholder="Tu nombre completo"
                    >
                    @if (showError('nombre')) {
                      <span class="form-error">El nombre es requerido</span>
                    }
                  </div>

                  <div class="form-group">
                    <label for="telefono">Telefono (WhatsApp) *</label>
                    <input
                      type="tel"
                      id="telefono"
                      formControlName="telefono"
                      class="form-control"
                      placeholder="+1 234 567 8900"
                    >
                    @if (showError('telefono')) {
                      <span class="form-error">El telefono es requerido</span>
                    }
                  </div>

                  <div class="form-group">
                    <label for="email">Email (opcional)</label>
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
                    <label for="servicio">Servicio deseado *</label>
                    <select
                      id="servicio"
                      formControlName="servicio"
                      class="form-control"
                    >
                      <option value="">Selecciona un servicio</option>
                      @for (service of availableServices(); track service.nombre) {
                        <option [value]="service.nombre">{{ service.nombre }}</option>
                      }
                    </select>
                    @if (showError('servicio')) {
                      <span class="form-error">Selecciona un servicio</span>
                    }
                  </div>

                  <div class="form-group">
                    <label for="fecha">Fecha preferida *</label>
                    <input
                      type="date"
                      id="fecha"
                      formControlName="fechaSolicitada"
                      class="form-control"
                      [min]="minDate"
                    >
                    @if (showError('fechaSolicitada')) {
                      <span class="form-error">Selecciona una fecha</span>
                    }
                  </div>

                  <div class="form-group">
                    <label for="hora">Hora preferida *</label>
                    <select
                      id="hora"
                      formControlName="horaSolicitada"
                      class="form-control"
                    >
                      <option value="">Selecciona una hora</option>
                      @for (hora of horasDisponibles; track hora) {
                        <option [value]="hora">{{ hora }}</option>
                      }
                    </select>
                    @if (showError('horaSolicitada')) {
                      <span class="form-error">Selecciona una hora</span>
                    }
                  </div>
                </div>

                <div class="form-group full-width">
                  <label for="notas">Notas adicionales (opcional)</label>
                  <textarea
                    id="notas"
                    formControlName="notas"
                    class="form-control"
                    rows="4"
                    placeholder="Alguna preferencia o informacion adicional..."
                  ></textarea>
                </div>

                <div class="form-actions">
                  <button
                    type="submit"
                    class="btn btn--primary btn--lg btn--block"
                    [disabled]="isSubmitting()"
                  >
                    @if (isSubmitting()) {
                      <span class="spinner-sm"></span>
                      Enviando...
                    } @else {
                      Solicitar Cita
                    }
                  </button>
                </div>

                <p class="form-note">
                  * Campos requeridos. Te contactaremos para confirmar tu cita.
                </p>
              </form>
            } @else {
              <div class="success-message">
                <div class="success-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h2>Solicitud Enviada</h2>
                <p>
                  Gracias por tu solicitud. Nos pondremos en contacto contigo
                  pronto para confirmar tu cita.
                </p>
                <button
                  type="button"
                  class="btn btn--primary"
                  (click)="resetForm()"
                >
                  Hacer otra reservacion
                </button>
              </div>
            }
          </div>

          <div class="info-sidebar">
            <div class="info-card">
              <h3>Informacion de Contacto</h3>
              <ul>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span>+1 234 567 8900</span>
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>info&#64;sunsetbeautyspa.com</span>
                </li>
              </ul>
            </div>

            <div class="info-card">
              <h3>Horarios de Atencion</h3>
              <ul class="hours-list">
                <li><span>Lunes - Viernes</span> <span>9:00 AM - 7:00 PM</span></li>
                <li><span>Sabados</span> <span>9:00 AM - 5:00 PM</span></li>
                <li><span>Domingos</span> <span>10:00 AM - 3:00 PM</span></li>
              </ul>
            </div>

            <div class="info-card highlight">
              <h3>Prefieres WhatsApp?</h3>
              <p>Escribenos directamente y te atenderemos al instante</p>
              <a href="#" class="btn btn--whatsapp">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chatea con nosotros
              </a>
            </div>
          </div>
        </div>
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
        max-width: 500px;
        margin: 0 auto;
      }
    }

    .container {
      @include container;
    }

    .reservation-section {
      background-color: $color-background;
    }

    .reservation-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: $spacing-2xl;

      @include respond-below('lg') {
        grid-template-columns: 1fr;
      }
    }

    .form-container {
      background-color: $color-white;
      padding: $spacing-2xl;
      border-radius: $border-radius-lg;
      box-shadow: $shadow-md;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-lg;

      @include respond-below('md') {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      margin-bottom: $spacing-lg;

      &.full-width {
        grid-column: 1 / -1;
      }

      label {
        display: block;
        margin-bottom: $spacing-xs;
        font-weight: $font-weight-medium;
        color: $color-text;
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

    .form-actions {
      margin-top: $spacing-lg;

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: $spacing-sm;
      }
    }

    .spinner-sm {
      width: 20px;
      height: 20px;
      border: 2px solid rgba($color-white, 0.3);
      border-top-color: $color-white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .form-note {
      margin-top: $spacing-md;
      font-size: $font-size-sm;
      color: lighten($color-text, 30%);
      text-align: center;
    }

    // Success Message
    .success-message {
      text-align: center;
      padding: $spacing-2xl;

      .success-icon {
        @include flex-center;
        width: 100px;
        height: 100px;
        margin: 0 auto $spacing-xl;
        background-color: $color-success;
        border-radius: $border-radius-full;
        color: $color-white;
      }

      h2 {
        font-size: $font-size-2xl;
        margin-bottom: $spacing-md;
      }

      p {
        color: lighten($color-text, 20%);
        max-width: 400px;
        margin: 0 auto $spacing-xl;
      }
    }

    // Info Sidebar
    .info-sidebar {
      @include respond-below('lg') {
        order: -1;
      }
    }

    .info-card {
      background-color: $color-white;
      padding: $spacing-xl;
      border-radius: $border-radius-lg;
      box-shadow: $shadow-md;
      margin-bottom: $spacing-lg;

      &.highlight {
        background: linear-gradient(135deg, $color-primary 0%, darken($color-primary, 10%) 100%);
        color: $color-white;

        h3 {
          color: $color-white;
        }

        p {
          color: rgba($color-white, 0.9);
          margin-bottom: $spacing-md;
        }
      }

      h3 {
        font-size: $font-size-lg;
        margin-bottom: $spacing-md;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          display: flex;
          align-items: center;
          gap: $spacing-sm;
          margin-bottom: $spacing-sm;
          color: lighten($color-text, 15%);

          svg {
            color: $color-primary;
            flex-shrink: 0;
          }
        }
      }

      .hours-list li {
        justify-content: space-between;
      }
    }

    .btn--whatsapp {
      @include button-base;
      background-color: #25D366;
      color: $color-white;
      width: 100%;
      gap: $spacing-sm;

      &:hover {
        background-color: darken(#25D366, 10%);
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ReservationsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reservationService = inject(ReservationService);
  private spaServicesService = inject(SpaServicesService);

  reservationForm!: FormGroup;
  isSubmitting = signal(false);
  submitted = signal(false);
  availableServices = signal<SpaService[]>([]);

  minDate = new Date().toISOString().split('T')[0];

  horasDisponibles = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM'
  ];

  defaultServices: SpaService[] = [
    { nombre: 'Facial Rejuvenecedor', descripcion: '', categoria: 'facial', duracion: '60 min', activo: true },
    { nombre: 'Limpieza Facial Profunda', descripcion: '', categoria: 'facial', duracion: '45 min', activo: true },
    { nombre: 'Masaje Relajante', descripcion: '', categoria: 'masajes', duracion: '90 min', activo: true },
    { nombre: 'Masaje con Piedras Calientes', descripcion: '', categoria: 'masajes', duracion: '75 min', activo: true },
    { nombre: 'Tratamiento Corporal Reductor', descripcion: '', categoria: 'corporal', duracion: '60 min', activo: true },
    { nombre: 'Exfoliacion Corporal', descripcion: '', categoria: 'corporal', duracion: '45 min', activo: true },
    { nombre: 'Manicure Spa', descripcion: '', categoria: 'unas', duracion: '45 min', activo: true },
    { nombre: 'Pedicure Spa', descripcion: '', categoria: 'unas', duracion: '60 min', activo: true },
    { nombre: 'Depilacion con Cera', descripcion: '', categoria: 'depilacion', duracion: '30-60 min', activo: true }
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadServices();
  }

  private initForm(): void {
    this.reservationForm = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.email],
      servicio: ['', Validators.required],
      fechaSolicitada: ['', Validators.required],
      horaSolicitada: ['', Validators.required],
      notas: ['']
    });
  }

  private loadServices(): void {
    this.spaServicesService.getActiveServices().subscribe(services => {
      if (services.length > 0) {
        this.availableServices.set(services);
      } else {
        this.availableServices.set(this.defaultServices);
      }
    });
  }

  showError(field: string): boolean {
    const control = this.reservationForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      this.isSubmitting.set(true);

      const formData = this.reservationForm.value;

      this.reservationService.createReservation({
        ...formData,
        estado: 'pendiente',
        fechaCreacion: new Date()
      }).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.submitted.set(true);
        },
        error: (error) => {
          console.error('Error creating reservation:', error);
          this.isSubmitting.set(false);
          this.submitted.set(true);
        }
      });
    } else {
      Object.keys(this.reservationForm.controls).forEach(key => {
        this.reservationForm.get(key)?.markAsTouched();
      });
    }
  }

  resetForm(): void {
    this.reservationForm.reset();
    this.submitted.set(false);
  }
}
