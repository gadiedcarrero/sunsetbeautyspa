import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { SpaService } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SpaServicesService {
  private firebase = inject(FirebaseService);
  private readonly COLLECTION = 'servicios';

  services = signal<SpaService[]>([]);

  getAllServices(): Observable<SpaService[]> {
    return this.firebase.getCollection<SpaService>(
      this.COLLECTION,
      this.firebase.orderByField('categoria', 'asc')
    ).pipe(
      tap(services => this.services.set(services))
    );
  }

  getActiveServices(): Observable<SpaService[]> {
    return this.firebase.getCollection<SpaService>(
      this.COLLECTION,
      this.firebase.whereEqual('activo', true),
      this.firebase.orderByField('categoria', 'asc')
    );
  }

  getServicesByCategory(category: string): Observable<SpaService[]> {
    return this.firebase.getCollection<SpaService>(
      this.COLLECTION,
      this.firebase.whereEqual('categoria', category),
      this.firebase.whereEqual('activo', true)
    );
  }

  getServiceById(id: string): Observable<SpaService | undefined> {
    return this.firebase.getDocument<SpaService>(this.COLLECTION, id);
  }

  createService(service: Omit<SpaService, 'id'>): Observable<string> {
    return this.firebase.addDocument(this.COLLECTION, service);
  }

  updateService(id: string, data: Partial<SpaService>): Observable<void> {
    return this.firebase.updateDocument(this.COLLECTION, id, data);
  }

  deleteService(id: string): Observable<void> {
    return this.firebase.deleteDocument(this.COLLECTION, id);
  }

  toggleServiceStatus(id: string, activo: boolean): Observable<void> {
    return this.updateService(id, { activo });
  }
}
