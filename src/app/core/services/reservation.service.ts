import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { Reservation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private firebase = inject(FirebaseService);
  private readonly COLLECTION = 'reservaciones';

  getAllReservations(): Observable<Reservation[]> {
    return this.firebase.getCollection<Reservation>(
      this.COLLECTION,
      this.firebase.orderByField('fechaCreacion', 'desc')
    );
  }

  getPendingReservations(): Observable<Reservation[]> {
    return this.firebase.getCollection<Reservation>(
      this.COLLECTION,
      this.firebase.whereEqual('estado', 'pendiente'),
      this.firebase.orderByField('fechaSolicitada', 'asc')
    );
  }

  getReservationById(id: string): Observable<Reservation | undefined> {
    return this.firebase.getDocument<Reservation>(this.COLLECTION, id);
  }

  createReservation(reservation: Omit<Reservation, 'id'>): Observable<string> {
    const data = {
      ...reservation,
      fechaCreacion: new Date(),
      estado: 'pendiente' as const
    };
    return this.firebase.addDocument(this.COLLECTION, data);
  }

  updateReservation(id: string, data: Partial<Reservation>): Observable<void> {
    return this.firebase.updateDocument(this.COLLECTION, id, data);
  }

  confirmReservation(id: string): Observable<void> {
    return this.updateReservation(id, { estado: 'confirmada' });
  }

  cancelReservation(id: string): Observable<void> {
    return this.updateReservation(id, { estado: 'cancelada' });
  }
}
