import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { Conversation, Message } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private firebase = inject(FirebaseService);
  private readonly COLLECTION = 'conversaciones';

  getAllConversations(): Observable<Conversation[]> {
    return this.firebase.getCollection<Conversation>(
      this.COLLECTION,
      this.firebase.orderByField('fechaUltimoMensaje', 'desc')
    );
  }

  getActiveConversations(): Observable<Conversation[]> {
    return this.firebase.getCollection<Conversation>(
      this.COLLECTION,
      this.firebase.whereEqual('estado', 'activa'),
      this.firebase.orderByField('fechaUltimoMensaje', 'desc')
    );
  }

  getConversationsByClient(clienteId: string): Observable<Conversation[]> {
    return this.firebase.getCollection<Conversation>(
      this.COLLECTION,
      this.firebase.whereEqual('clienteId', clienteId),
      this.firebase.orderByField('fechaInicio', 'desc')
    );
  }

  getConversationById(id: string): Observable<Conversation | undefined> {
    return this.firebase.getDocument<Conversation>(this.COLLECTION, id);
  }

  createConversation(conversation: Omit<Conversation, 'id'>): Observable<string> {
    const data = {
      ...conversation,
      fechaInicio: new Date(),
      fechaUltimoMensaje: new Date(),
      estado: 'activa' as const
    };
    return this.firebase.addDocument(this.COLLECTION, data);
  }

  addMessage(id: string, message: Message, mensajes: Message[]): Observable<void> {
    const updatedMensajes = [...mensajes, message];
    return this.firebase.updateDocument(this.COLLECTION, id, {
      mensajes: updatedMensajes,
      fechaUltimoMensaje: new Date()
    });
  }

  updateConversationStatus(id: string, estado: Conversation['estado']): Observable<void> {
    return this.firebase.updateDocument(this.COLLECTION, id, { estado });
  }

  updateSummary(id: string, resumen: string): Observable<void> {
    return this.firebase.updateDocument(this.COLLECTION, id, { resumen });
  }

  closeConversation(id: string): Observable<void> {
    return this.updateConversationStatus(id, 'cerrada');
  }

  deriveConversation(id: string): Observable<void> {
    return this.updateConversationStatus(id, 'derivada');
  }
}
