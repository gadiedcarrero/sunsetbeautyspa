import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClientService } from '../../../../core/services/client.service';
import { Client } from '../../../../core/models';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="client-detail">
      <a routerLink="/admin/clientes" class="back-link">Volver a clientes</a>
      <h2>Detalle del Cliente</h2>
      @if (client()) {
        <div class="card">
          <p><strong>Nombre:</strong> {{ client()?.nombre }}</p>
          <p><strong>Telefono:</strong> {{ client()?.telefono }}</p>
          <p><strong>Email:</strong> {{ client()?.email || 'No registrado' }}</p>
          <p><strong>Estado:</strong> {{ client()?.estado }}</p>
          <p><strong>Creado:</strong> {{ formatDate(client()?.fechaCreacion) }}</p>
          <p><strong>Ultima interaccion:</strong> {{ formatDate(client()?.ultimaInteraccion) }}</p>
        </div>

        <div class="card">
          <h3>Actualizar estado</h3>
          <select class="status-select" (change)="updateStatus($any($event.target).value)">
            <option value="nuevo" [selected]="client()?.estado === 'nuevo'">Nuevo</option>
            <option value="contactado" [selected]="client()?.estado === 'contactado'">Contactado</option>
            <option value="cita" [selected]="client()?.estado === 'cita'">Cita</option>
            <option value="cerrado" [selected]="client()?.estado === 'cerrado'">Cerrado</option>
          </select>
        </div>

        <div class="card">
          <h3>Notas</h3>
          <textarea
            class="note-input"
            rows="4"
            [value]="note()"
            (input)="note.set($any($event.target).value)"
            placeholder="Agrega una nota..."
          ></textarea>
          <button class="btn-save" type="button" (click)="saveNote()">Guardar nota</button>
        </div>
      } @else {
        <div class="card">
          <p>No se encontro el cliente.</p>
        </div>
      }
    </section>
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .client-detail {
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;
    }

    .back-link {
      color: $color-primary;
      text-decoration: none;
    }

    .card {
      background-color: $color-white;
      border-radius: $border-radius-lg;
      padding: $spacing-lg;
      box-shadow: $shadow-sm;
    }

    .status-select,
    .note-input {
      width: 100%;
      border: 1px solid $color-secondary;
      border-radius: $border-radius-md;
      padding: $spacing-sm $spacing-md;
      font-family: $font-body;
    }

    .note-input {
      margin-bottom: $spacing-md;
      resize: vertical;
      min-height: 120px;
    }

    .btn-save {
      background-color: $color-primary;
      color: $color-white;
      border: none;
      border-radius: $border-radius-md;
      padding: $spacing-sm $spacing-lg;
      cursor: pointer;
    }
  `]
})
export class ClientDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private clientService = inject(ClientService);
  private destroyRef = inject(DestroyRef);

  client = signal<Client | null>(null);
  note = signal('');

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (!clientId) {
      return;
    }
    this.clientService.getClientById(clientId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(client => {
        this.client.set(client ?? null);
        this.note.set(client?.notas ?? '');
      });
  }

  updateStatus(status: Client['estado']): void {
    const clientId = this.client()?.id;
    if (!clientId) {
      return;
    }
    this.clientService.updateClientStatus(clientId, status).subscribe();
  }

  saveNote(): void {
    const clientId = this.client()?.id;
    if (!clientId) {
      return;
    }
    this.clientService.addClientNote(clientId, this.note()).subscribe();
  }

  formatDate(value: unknown): string {
    const date = this.toDate(value);
    return date ? date.toLocaleString('es-ES') : '-';
  }

  private toDate(value: unknown): Date | null {
    if (!value) {
      return null;
    }
    if (value instanceof Date) {
      return value;
    }
    const maybe = value as { toDate?: () => Date };
    if (maybe && typeof maybe.toDate === 'function') {
      return maybe.toDate();
    }
    const parsed = new Date(value as string);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
}
