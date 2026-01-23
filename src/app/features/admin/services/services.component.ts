import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpaServicesService } from '../../../core/services/spa-services.service';
import { SpaService } from '../../../core/models';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImageUploadComponent],
  template: `
    <section class="services">
      <div class="header">
        <h2>Servicios</h2>
        <button type="button" class="btn-add" (click)="openNewForm()">
          Nuevo servicio
        </button>
      </div>

      @if (showForm()) {
        <div class="form-overlay" (click)="closeForm()"></div>
        <form class="service-form" [formGroup]="serviceForm" (ngSubmit)="saveService()">
          <div class="form-header">
            <h3>{{ editingService() ? 'Editar servicio' : 'Nuevo servicio' }}</h3>
            <button type="button" class="btn-close" (click)="closeForm()">&times;</button>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Nombre *</label>
              <input class="form-input" formControlName="nombre" placeholder="Ej: Facial Hidratante" />
            </div>
            <div class="form-group">
              <label>Duracion *</label>
              <input class="form-input" formControlName="duracion" placeholder="Ej: 60 min" />
            </div>
            <div class="form-group">
              <label>Precio</label>
              <input class="form-input" formControlName="precio" type="number" placeholder="Ej: 85" />
            </div>
            <div class="form-group">
              <label>Categoria *</label>
              <select class="form-input" formControlName="categoria">
                <option value="">Seleccionar categoria</option>
                <option value="facial">Facial</option>
                <option value="corporal">Corporal</option>
                <option value="masajes">Masajes</option>
                <option value="unas">Unas</option>
                <option value="depilacion">Depilacion</option>
                <option value="otros">Otros</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label>Imagen del servicio</label>
              <app-image-upload
                [imageUrl]="serviceForm.get('imagen')?.value"
                storagePath="services"
                (imageUploaded)="onImageUploaded($event)"
                (imageRemoved)="onImageRemoved()"
              ></app-image-upload>
            </div>
          </div>
          <div class="form-group">
            <label>Descripcion *</label>
            <textarea class="form-input" formControlName="descripcion" rows="3" placeholder="Describe el servicio..."></textarea>
          </div>
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="activo" />
              <span>Servicio activo</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" formControlName="destacado" />
              <span>Destacar en portada</span>
            </label>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="closeForm()">Cancelar</button>
            <button class="btn-add" type="submit" [disabled]="serviceForm.invalid || saving()">
              {{ saving() ? 'Guardando...' : (editingService() ? 'Actualizar' : 'Crear servicio') }}
            </button>
          </div>
        </form>
      }

      @if (deleteConfirm()) {
        <div class="form-overlay" (click)="cancelDelete()"></div>
        <div class="confirm-dialog">
          <h3>Confirmar eliminacion</h3>
          <p>Estas segura de eliminar el servicio <strong>{{ deleteConfirm()?.nombre }}</strong>?</p>
          <p class="warning">Esta accion no se puede deshacer.</p>
          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="cancelDelete()">Cancelar</button>
            <button type="button" class="btn-danger" (click)="confirmDelete()">Eliminar</button>
          </div>
        </div>
      }

      <div class="table">
        <div class="row header-row">
          <span>Servicio</span>
          <span>Categoria</span>
          <span>Duracion</span>
          <span>Precio</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>
        @for (service of services(); track service.id) {
          <div class="row" [class.inactive]="!service.activo">
            <span class="service-info">
              @if (service.imagen) {
                <img [src]="service.imagen" [alt]="service.nombre" class="service-thumb" />
              } @else {
                <div class="service-thumb placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              }
              <span class="service-name">
                {{ service.nombre }}
                @if (service.destacado) {
                  <span class="featured-badge" title="Destacado en portada">★</span>
                }
              </span>
            </span>
            <span class="category-badge">{{ getCategoryLabel(service.categoria) }}</span>
            <span>{{ service.duracion }}</span>
            <span>{{ service.precio ? '$' + service.precio : '-' }}</span>
            <span>
              <span class="status-badge" [class.active]="service.activo" [class.inactive]="!service.activo">
                {{ service.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </span>
            <span class="actions">
              <button type="button" class="btn-icon" title="Editar" (click)="editService(service)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button type="button" class="btn-icon" [title]="service.activo ? 'Desactivar' : 'Activar'" (click)="toggleStatus(service)">
                @if (service.activo) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                }
              </button>
              <button type="button" class="btn-icon danger" title="Eliminar" (click)="deleteService(service)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </span>
          </div>
        } @empty {
          <div class="row empty-row">
            <span>No hay servicios registrados. Crea el primero!</span>
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
      padding: $spacing-sm $spacing-lg;
      cursor: pointer;
      font-weight: $font-weight-medium;
      transition: all $transition-base;

      &:hover:not(:disabled) {
        background-color: darken($color-primary, 10%);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .form-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 100;
    }

    .service-form {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: $color-white;
      border-radius: $border-radius-lg;
      padding: $spacing-xl;
      box-shadow: $shadow-lg;
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
      z-index: 101;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-sm;

      h3 {
        margin: 0;
        font-size: $font-size-xl;
      }
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: lighten($color-text, 30%);
      padding: 0;
      line-height: 1;

      &:hover {
        color: $color-text;
      }
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-md;

      @include respond-below('md') {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;

      &.full-width {
        grid-column: 1 / -1;
      }

      label {
        font-size: $font-size-sm;
        font-weight: $font-weight-medium;
        color: lighten($color-text, 10%);
      }
    }

    .checkbox-group {
      .checkbox-label {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        cursor: pointer;

        input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      }
    }

    .form-input {
      padding: $spacing-sm $spacing-md;
      border: 1px solid $color-secondary;
      border-radius: $border-radius-md;
      font-family: $font-body;
      font-size: $font-size-base;
      transition: border-color $transition-base;

      &:focus {
        outline: none;
        border-color: $color-primary;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: $spacing-md;
      margin-top: $spacing-md;
    }

    .btn-cancel {
      background: transparent;
      border: 1px solid $color-secondary;
      padding: $spacing-sm $spacing-lg;
      border-radius: $border-radius-md;
      cursor: pointer;
      font-weight: $font-weight-medium;
      transition: all $transition-base;

      &:hover {
        background-color: $color-secondary;
      }
    }

    .confirm-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: $color-white;
      border-radius: $border-radius-lg;
      padding: $spacing-xl;
      box-shadow: $shadow-lg;
      z-index: 101;
      width: 90%;
      max-width: 400px;
      text-align: center;

      h3 {
        margin: 0 0 $spacing-md;
      }

      p {
        margin: 0 0 $spacing-sm;
        color: lighten($color-text, 20%);
      }

      .warning {
        color: $color-error;
        font-size: $font-size-sm;
      }

      .form-actions {
        justify-content: center;
        margin-top: $spacing-lg;
      }
    }

    .btn-danger {
      background-color: $color-error;
      color: $color-white;
      border: none;
      border-radius: $border-radius-md;
      padding: $spacing-sm $spacing-lg;
      cursor: pointer;
      font-weight: $font-weight-medium;
      transition: all $transition-base;

      &:hover {
        background-color: darken($color-error, 10%);
      }
    }

    .table {
      background-color: $color-white;
      border-radius: $border-radius-lg;
      box-shadow: $shadow-sm;
      overflow: hidden;
    }

    .row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 0.8fr 0.8fr 1fr;
      padding: $spacing-md $spacing-lg;
      border-bottom: 1px solid $color-secondary;
      align-items: center;

      &.inactive {
        opacity: 0.6;
        background-color: rgba($color-secondary, 0.3);
      }

      @include respond-below('lg') {
        grid-template-columns: 2fr 1fr 1fr 1fr;

        span:nth-child(4),
        span:nth-child(5) {
          display: none;
        }
      }
    }

    .header-row {
      background-color: $color-secondary;
      font-weight: $font-weight-semibold;
      font-size: $font-size-sm;
    }

    .service-info {
      display: flex;
      align-items: center;
      gap: $spacing-md;
    }

    .service-thumb {
      width: 40px;
      height: 40px;
      border-radius: $border-radius-md;
      object-fit: cover;

      &.placeholder {
        background-color: $color-secondary;
        display: flex;
        align-items: center;
        justify-content: center;
        color: lighten($color-text, 40%);
      }
    }

    .service-name {
      font-weight: $font-weight-medium;
      display: flex;
      align-items: center;
      gap: $spacing-xs;
    }

    .featured-badge {
      color: #f59e0b;
      font-size: $font-size-base;
    }

    .category-badge {
      display: inline-block;
      padding: $spacing-xs $spacing-sm;
      background-color: $color-secondary;
      border-radius: $border-radius-sm;
      font-size: $font-size-xs;
      text-transform: capitalize;
    }

    .status-badge {
      display: inline-block;
      padding: $spacing-xs $spacing-sm;
      border-radius: $border-radius-sm;
      font-size: $font-size-xs;
      font-weight: $font-weight-medium;

      &.active {
        background-color: rgba(#22c55e, 0.15);
        color: #16a34a;
      }

      &.inactive {
        background-color: rgba($color-error, 0.15);
        color: $color-error;
      }
    }

    .actions {
      display: flex;
      gap: $spacing-xs;
    }

    .btn-icon {
      background: transparent;
      border: 1px solid $color-secondary;
      padding: $spacing-xs;
      border-radius: $border-radius-md;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: lighten($color-text, 20%);
      transition: all $transition-base;

      &:hover {
        background-color: $color-secondary;
        color: $color-text;
      }

      &.danger {
        &:hover {
          background-color: rgba($color-error, 0.1);
          border-color: $color-error;
          color: $color-error;
        }
      }
    }

    .empty-row {
      grid-template-columns: 1fr;
      color: lighten($color-text, 30%);
      text-align: center;
      padding: $spacing-2xl;
    }
  `]
})
export class AdminServicesComponent implements OnInit {
  private servicesService = inject(SpaServicesService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  services = signal<SpaService[]>([]);
  showForm = signal(false);
  editingService = signal<SpaService | null>(null);
  deleteConfirm = signal<SpaService | null>(null);
  saving = signal(false);

  serviceForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: [null],
    duracion: ['', Validators.required],
    categoria: ['', Validators.required],
    imagen: [''],
    activo: [true],
    destacado: [false]
  });

  ngOnInit(): void {
    this.servicesService.getAllServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(services => this.services.set(services));
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'facial': 'Facial',
      'corporal': 'Corporal',
      'masajes': 'Masajes',
      'unas': 'Unas',
      'depilacion': 'Depilacion',
      'otros': 'Otros'
    };
    return labels[category] || category;
  }

  openNewForm(): void {
    this.editingService.set(null);
    this.serviceForm.reset({ activo: true, destacado: false, precio: null });
    this.showForm.set(true);
  }

  editService(service: SpaService): void {
    this.editingService.set(service);
    this.serviceForm.patchValue({
      nombre: service.nombre,
      descripcion: service.descripcion,
      precio: service.precio || null,
      duracion: service.duracion,
      categoria: service.categoria,
      imagen: service.imagen || '',
      activo: service.activo,
      destacado: service.destacado || false
    });
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingService.set(null);
    this.serviceForm.reset({ activo: true, destacado: false, precio: null });
  }

  saveService(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const formValue = this.serviceForm.value as SpaService;
    const editing = this.editingService();

    if (editing?.id) {
      this.servicesService.updateService(editing.id, formValue).subscribe({
        next: () => {
          this.closeForm();
          this.saving.set(false);
        },
        error: () => this.saving.set(false)
      });
    } else {
      this.servicesService.createService(formValue).subscribe({
        next: () => {
          this.closeForm();
          this.saving.set(false);
        },
        error: () => this.saving.set(false)
      });
    }
  }

  toggleStatus(service: SpaService): void {
    if (!service.id) {
      return;
    }
    this.servicesService.toggleServiceStatus(service.id, !service.activo).subscribe();
  }

  deleteService(service: SpaService): void {
    this.deleteConfirm.set(service);
  }

  cancelDelete(): void {
    this.deleteConfirm.set(null);
  }

  confirmDelete(): void {
    const service = this.deleteConfirm();
    if (!service?.id) {
      return;
    }
    this.servicesService.deleteService(service.id).subscribe(() => {
      this.deleteConfirm.set(null);
    });
  }

  onImageUploaded(url: string): void {
    this.serviceForm.patchValue({ imagen: url });
  }

  onImageRemoved(): void {
    this.serviceForm.patchValue({ imagen: '' });
  }
}
