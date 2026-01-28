import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClientService } from '../../../core/services/client.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { ConversationService } from '../../../core/services/conversation.service';
import { Client, Conversation, Reservation } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="dashboard">
      <h2>Resumen</h2>
      <div class="stats-grid">
        <a class="stat-card" routerLink="/admin/clientes">
          <span class="label">Clientes nuevos</span>
          <span class="value">{{ newClientsCount() }}</span>
        </a>
        <a class="stat-card" routerLink="/admin/reservaciones">
          <span class="label">Reservas pendientes</span>
          <span class="value">{{ pendingReservationsCount() }}</span>
        </a>
        <a class="stat-card" routerLink="/admin/conversaciones">
          <span class="label">Conversaciones activas</span>
          <span class="value">{{ activeConversationsCount() }}</span>
        </a>
      </div>

      <div class="panels">
        <div class="panel">
          <h3>Clientes recientes</h3>
          @if (recentClients().length > 0) {
            <ul>
              @for (client of recentClients(); track client.id) {
                <li>
                  <a class="panel-link" [routerLink]="['/admin/clientes', client.id]">
                    <span>{{ client.nombre }}</span>
                    <span class="muted">{{ formatDate(client.fechaCreacion) }}</span>
                  </a>
                </li>
              }
            </ul>
          } @else {
            <p class="muted">Sin clientes recientes.</p>
          }
        </div>

        <div class="panel">
          <h3>Reservaciones pendientes</h3>
          @if (pendingReservations().length > 0) {
            <ul>
              @for (reservation of pendingReservations(); track reservation.id) {
                <li>
                  <a class="panel-link" routerLink="/admin/reservaciones">
                    <span>{{ reservation.nombre }}</span>
                    <span class="muted">{{ reservation.fechaSolicitada }} {{ reservation.horaSolicitada }}</span>
                  </a>
                </li>
              }
            </ul>
          } @else {
            <p class="muted">No hay reservaciones pendientes.</p>
          }
        </div>

        <div class="panel">
          <h3>Conversaciones activas</h3>
          @if (activeConversations().length > 0) {
            <ul>
              @for (conversation of activeConversations(); track conversation.id) {
                <li>
                  <a class="panel-link" [routerLink]="['/admin/conversaciones', conversation.id]">
                    <span>{{ conversation.telefono }}</span>
                    <span class="muted">{{ formatDate(conversation.fechaUltimoMensaje) }}</span>
                  </a>
                </li>
              }
            </ul>
          } @else {
            <p class="muted">No hay conversaciones activas.</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .dashboard {
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $spacing-lg;
    }

    .stat-card {
      background-color: $color-white;
      border-radius: $border-radius-lg;
      padding: $spacing-lg;
      box-shadow: $shadow-sm;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      color: inherit;
      text-decoration: none;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .stat-card:hover,
    .stat-card:focus-visible {
      transform: translateY(-2px);
      box-shadow: $shadow-md;
    }

    .label {
      color: lighten($color-text, 20%);
      font-size: $font-size-sm;
    }

    .value {
      font-size: $font-size-2xl;
      font-weight: $font-weight-bold;
    }

    .panels {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $spacing-lg;
    }

    .panel {
      background-color: $color-white;
      border-radius: $border-radius-lg;
      padding: $spacing-lg;
      box-shadow: $shadow-sm;

      h3 {
        margin-bottom: $spacing-md;
        font-size: $font-size-md;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;
      }

      li {
        margin: 0;
      }
    }

    .panel-link {
      display: flex;
      justify-content: space-between;
      gap: $spacing-md;
      color: inherit;
      text-decoration: none;
    }

    .panel-link:hover,
    .panel-link:focus-visible {
      text-decoration: underline;
    }

    .muted {
      color: lighten($color-text, 25%);
      font-size: $font-size-sm;
    }

    @include respond-below('lg') {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .panels {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private clientService = inject(ClientService);
  private reservationService = inject(ReservationService);
  private conversationService = inject(ConversationService);
  private destroyRef = inject(DestroyRef);

  recentClients = signal<Client[]>([]);
  pendingReservations = signal<Reservation[]>([]);
  activeConversations = signal<Conversation[]>([]);

  newClientsCount = computed(() => this.recentClients().length);
  pendingReservationsCount = computed(() => this.pendingReservations().length);
  activeConversationsCount = computed(() => this.activeConversations().length);

  ngOnInit(): void {
    this.clientService.getRecentClients(5)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(clients => this.recentClients.set(clients));

    this.reservationService.getPendingReservations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(reservations => this.pendingReservations.set(reservations.slice(0, 5)));

    this.conversationService.getActiveConversations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(conversations => this.activeConversations.set(conversations.slice(0, 5)));
  }

  formatDate(value: unknown): string {
    const date = this.toDate(value);
    return date ? date.toLocaleDateString('es-ES') : '-';
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
