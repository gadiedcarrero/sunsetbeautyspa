import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models';

@Component({
  selector: 'app-admin-clients',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="clients">
      <div class="header">
        <h2>Clientes</h2>
        <div class="filters">
          <select class="filter" (change)="setStatusFilter($any($event.target).value)">
            <option value="all">Todos</option>
            <option value="nuevo">Nuevo</option>
            <option value="contactado">Contactado</option>
            <option value="cita">Cita</option>
            <option value="cerrado">Cerrado</option>
          </select>
          <input
            class="search"
            type="text"
            placeholder="Buscar cliente..."
            (input)="setSearchTerm($any($event.target).value)"
          />
        </div>
      </div>
      <div class="table">
        <div class="row header-row">
          <span>Nombre</span>
          <span>Telefono</span>
          <span>Estado</span>
          <span></span>
        </div>
        @for (client of filteredClients(); track client.id) {
          <div class="row">
            <span>{{ client.nombre }}</span>
            <span>{{ client.telefono }}</span>
            <span class="status">{{ client.estado }}</span>
            <a [routerLink]="['/admin/clientes', client.id]">Ver</a>
          </div>
        } @empty {
          <div class="row empty-row">
            <span>No hay clientes para mostrar.</span>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .clients {
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: $spacing-md;

      @include respond-below('md') {
        flex-direction: column;
        align-items: stretch;
      }
    }

    .filters {
      display: flex;
      gap: $spacing-sm;
      align-items: center;

      @include respond-below('md') {
        flex-direction: column;
        align-items: stretch;
      }
    }

    .filter,
    .search {
      padding: $spacing-sm $spacing-md;
      border: 1px solid $color-secondary;
      border-radius: $border-radius-md;
    }

    .table {
      background-color: $color-white;
      border-radius: $border-radius-lg;
      box-shadow: $shadow-sm;
      overflow: hidden;
    }

    .row {
      display: grid;
      grid-template-columns: 2fr 1.5fr 1fr 0.5fr;
      padding: $spacing-md $spacing-lg;
      border-bottom: 1px solid $color-secondary;
    }

    .header-row {
      background-color: $color-secondary;
      font-weight: $font-weight-semibold;
    }

    .status {
      text-transform: capitalize;
    }

    .empty-row {
      grid-template-columns: 1fr;
      color: lighten($color-text, 20%);
    }
  `]
})
export class ClientsComponent implements OnInit {
  private clientService = inject(ClientService);
  private destroyRef = inject(DestroyRef);

  clients = signal<Client[]>([]);
  selectedStatus = signal<'all' | Client['estado']>('all');
  searchTerm = signal('');

  filteredClients = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();
    return this.clients().filter(client => {
      const matchesStatus = status === 'all' || client.estado === status;
      const matchesTerm = !term
        || client.nombre.toLowerCase().includes(term)
        || client.telefono.toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
  });

  ngOnInit(): void {
    this.clientService.getAllClients()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(clients => this.clients.set(clients));
  }

  setStatusFilter(status: 'all' | Client['estado']): void {
    this.selectedStatus.set(status);
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }
}
