import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpaServicesService } from '../../../core/services/spa-services.service';
import { SpaService } from '../../../core/models';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="services">
      <div class="header">
        <h2>Servicios</h2>
        <button type="button" class="btn-add" (click)="toggleForm()">
          {{ showForm() ? 'Cerrar' : 'Nuevo servicio' }}
        </button>
      </div>

      @if (showForm()) {
        <form class="service-form" [formGroup]="serviceForm" (ngSubmit)="createService()">
          <div class="form-grid">
            <input class="form-input" formControlName="nombre" placeholder="Nombre" />
            <input class="form-input" formControlName="duracion" placeholder="Duracion (ej: 60 min)" />
            <input class="form-input" formControlName="precio" type="number" placeholder="Precio (opcional)" />
            <select class="form-input" formControlName="categoria">
              <option value="">Categoria</option>
              <option value="facial">Facial</option>
              <option value="corporal">Corporal</option>
              <option value="masajes">Masajes</option>
              <option value="unas">Unas</option>
              <option value="depilacion">Depilacion</option>
              <option value="otros">Otros</option>
            </select>
          </div>
          <textarea class="form-input" formControlName="descripcion" rows="3" placeholder="Descripcion"></textarea>
          <button class="btn-add" type="submit" [disabled]="serviceForm.invalid">Guardar</button>
        </form>
      }

      <div class="table">
        <div class="row header-row">
          <span>Nombre</span>
          <span>Categoria</span>
          <span>Duracion</span>
          <span>Activo</span>
          <span>Acciones</span>
        </div>
        @for (service of services(); track service.id) {
          <div class="row">
            <span>{{ service.nombre }}</span>
            <span>{{ service.categoria }}</span>
            <span>{{ service.duracion }}</span>
            <span>{{ service.activo ? 'si' : 'no' }}</span>
            <span class="actions">
              <button
                type="button"
                class="btn-outline"
                (click)="toggleStatus(service)"
              >
                {{ service.activo ? 'Desactivar' : 'Activar' }}
              </button>
              <button
                type="button"
                class="btn-outline danger"
                (click)="deleteService(service)"
              >
                Eliminar
              </button>
            </span>
          </div>
        } @empty {
          <div class="row empty-row">
            <span>No hay servicios.</span>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .services {
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: $spacing-md;
    }

    .btn-add {
      background-color: $color-primary;
      color: $color-white;
      border: none;
      border-radius: $border-radius-md;
      padding: $spacing-sm $spacing-md;
      cursor: pointer;
    }

    .service-form {
      background-color: $color-white;
      border-radius: $border-radius-lg;
      padding: $spacing-lg;
      box-shadow: $shadow-sm;
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-md;

      @include respond-below('md') {
        grid-template-columns: 1fr;
      }
    }

    .form-input {
      padding: $spacing-sm $spacing-md;
      border: 1px solid $color-secondary;
      border-radius: $border-radius-md;
      font-family: $font-body;
    }

    .table {
      background-color: $color-white;
      border-radius: $border-radius-lg;
      box-shadow: $shadow-sm;
      overflow: hidden;
    }

    .row {
      display: grid;
      grid-template-columns: 2fr 1.5fr 1fr 0.75fr 1.5fr;
      padding: $spacing-md $spacing-lg;
      border-bottom: 1px solid $color-secondary;
    }

    .header-row {
      background-color: $color-secondary;
      font-weight: $font-weight-semibold;
    }

    .actions {
      display: flex;
      gap: $spacing-sm;
      flex-wrap: wrap;
    }

    .btn-outline {
      background: transparent;
      border: 1px solid $color-secondary;
      padding: $spacing-xs $spacing-sm;
      border-radius: $border-radius-md;
      cursor: pointer;
    }

    .btn-outline.danger {
      border-color: $color-error;
      color: $color-error;
    }

    .empty-row {
      grid-template-columns: 1fr;
      color: lighten($color-text, 20%);
    }
  `]
})
export class AdminServicesComponent implements OnInit {
  private servicesService = inject(SpaServicesService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  services = signal<SpaService[]>([]);
  showForm = signal(false);

  serviceForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: [null],
    duracion: ['', Validators.required],
    categoria: ['', Validators.required],
    imagen: [''],
    activo: [true]
  });

  ngOnInit(): void {
    this.servicesService.getAllServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(services => this.services.set(services));
  }

  toggleForm(): void {
    this.showForm.update(value => !value);
  }

  createService(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }
    const formValue = this.serviceForm.value as SpaService;
    this.servicesService.createService(formValue).subscribe(() => {
      this.serviceForm.reset({ activo: true, precio: null });
      this.showForm.set(false);
    });
  }

  toggleStatus(service: SpaService): void {
    if (!service.id) {
      return;
    }
    this.servicesService.toggleServiceStatus(service.id, !service.activo).subscribe();
  }

  deleteService(service: SpaService): void {
    if (!service.id) {
      return;
    }
    this.servicesService.deleteService(service.id).subscribe();
  }
}
