import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../core/models';

@Component({
  selector: 'app-admin-reservations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="reservations">
      <h2>Reservaciones</h2>
      <div class="table">
        <div class="row header-row">
          <span>Cliente</span>
          <span>Servicio</span>
          <span>Fecha</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>
        @for (reservation of reservations(); track reservation.id) {
          <div class="row">
            <span>{{ reservation.nombre }}</span>
            <span>{{ reservation.servicio }}</span>
            <span>{{ reservation.fechaSolicitada }} {{ reservation.horaSolicitada }}</span>
            <span class="status">{{ reservation.estado }}</span>
            <span class="actions">
              <button
                type="button"
                class="btn-outline"
                [disabled]="reservation.estado !== 'pendiente'"
                (click)="confirm(reservation)"
              >
                Confirmar
              </button>
              <button
                type="button"
                class="btn-outline danger"
                [disabled]="reservation.estado === 'cancelada'"
                (click)="cancel(reservation)"
              >
                Cancelar
              </button>
            </span>
          </div>
        } @empty {
          <div class="row empty-row">
            <span>No hay reservaciones.</span>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .reservations {
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;
    }

    .table {
      background-color: $color-white;
      border-radius: $border-radius-lg;
      box-shadow: $shadow-sm;
      overflow: hidden;
    }

    .row {
      display: grid;
      grid-template-columns: 2fr 2fr 1.5fr 1fr 1.5fr;
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
export class AdminReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private destroyRef = inject(DestroyRef);

  reservations = signal<Reservation[]>([]);

  ngOnInit(): void {
    this.reservationService.getAllReservations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(reservations => this.reservations.set(reservations));
  }

  confirm(reservation: Reservation): void {
    if (!reservation.id) {
      return;
    }
    this.reservationService.confirmReservation(reservation.id).subscribe();
  }

  cancel(reservation: Reservation): void {
    if (!reservation.id) {
      return;
    }
    this.reservationService.cancelReservation(reservation.id).subscribe();
  }
}
