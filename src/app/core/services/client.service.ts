import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { Client } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private firebase = inject(FirebaseService);
  private readonly COLLECTION = 'clientes';

  getAllClients(): Observable<Client[]> {
    return this.firebase.getCollection<Client>(
      this.COLLECTION,
      this.firebase.orderByField('fechaCreacion', 'desc')
    );
  }

  getRecentClients(count: number = 10): Observable<Client[]> {
    return this.firebase.getCollection<Client>(
      this.COLLECTION,
      this.firebase.orderByField('fechaCreacion', 'desc'),
      this.firebase.limitTo(count)
    );
  }

  getClientsByStatus(status: Client['estado']): Observable<Client[]> {
    return this.firebase.getCollection<Client>(
      this.COLLECTION,
      this.firebase.whereEqual('estado', status),
      this.firebase.orderByField('fechaCreacion', 'desc')
    );
  }

  getClientById(id: string): Observable<Client | undefined> {
    return this.firebase.getDocument<Client>(this.COLLECTION, id);
  }

  createClient(client: Omit<Client, 'id'>): Observable<string> {
    const data = {
      ...client,
      fechaCreacion: new Date(),
      estado: 'nuevo' as const
    };
    return this.firebase.addDocument(this.COLLECTION, data);
  }

  updateClient(id: string, data: Partial<Client>): Observable<void> {
    return this.firebase.updateDocument(this.COLLECTION, id, {
      ...data,
      ultimaInteraccion: new Date()
    });
  }

  updateClientStatus(id: string, estado: Client['estado']): Observable<void> {
    return this.updateClient(id, { estado });
  }

  addClientNote(id: string, nota: string): Observable<void> {
    return this.updateClient(id, { notas: nota });
  }
}
