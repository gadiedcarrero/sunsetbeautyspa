import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConversationService } from '../../../../core/services/conversation.service';
import { Conversation } from '../../../../core/models';

@Component({
  selector: 'app-conversation-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section class="conversation-detail">
      <a routerLink="/admin/conversaciones" class="back-link">← Volver a conversaciones</a>

      @if (conversation()) {
        <div class="conversation-header">
          <h2>Conversación</h2>
          <div class="status-badge" [class]="conversation()?.estado">
            {{ conversation()?.estado | uppercase }}
          </div>
        </div>

        <div class="phone-info">
          <strong>Teléfono:</strong> {{ conversation()?.telefono }}
        </div>

        <div class="chat">
          @for (message of conversation()?.mensajes || []; track $index) {
            <div class="message"
                 [class.bot]="message.rol === 'bot'"
                 [class.user]="message.rol === 'user'"
                 [class.admin]="message.rol === 'admin'">
              <span class="role">{{ getRoleName(message.rol) }}</span>
              <p>{{ message.contenido }}</p>
              <small>{{ formatDate(message.timestamp) }}</small>
            </div>
          } @empty {
            <p class="empty">No hay mensajes en esta conversación.</p>
          }
        </div>

        <!-- Formulario para responder -->
        @if (conversation()?.estado !== 'cerrada') {
          <div class="reply-section">
            <h3>Responder al cliente</h3>
            <div class="reply-form">
              <textarea
                [(ngModel)]="replyMessage"
                placeholder="Escribe tu mensaje..."
                rows="3"
                [disabled]="sending()">
              </textarea>
              <button
                type="button"
                class="btn-send"
                (click)="sendMessage()"
                [disabled]="!replyMessage.trim() || sending()">
                {{ sending() ? 'Enviando...' : 'Enviar mensaje' }}
              </button>
            </div>
            @if (sendError()) {
              <p class="error-message">{{ sendError() }}</p>
            }
            @if (sendSuccess()) {
              <p class="success-message">Mensaje enviado correctamente</p>
            }
          </div>
        }

        <div class="actions-section">
          <h3>Acciones</h3>
          <div class="summary-actions">
            @if (conversation()?.estado === 'derivada') {
              <button type="button" class="btn-primary" (click)="reactivate()">
                Reactivar Bot
              </button>
            }
            @if (conversation()?.estado === 'activa') {
              <button type="button" class="btn-warning" (click)="markDerived()">
                Derivar (desactivar bot)
              </button>
            }
            @if (conversation()?.estado !== 'cerrada') {
              <button type="button" class="btn-outline" (click)="markClosed()">
                Cerrar conversación
              </button>
            }
          </div>
        </div>

        <div class="summary">
          <h3>Resumen</h3>
          <p>{{ conversation()?.resumen || 'Sin resumen aún.' }}</p>
        </div>
      } @else {
        <div class="summary">
          <p>No se encontró la conversación.</p>
        </div>
      }
    </section>
  `,
  styles: [`
    @use 'styles/variables' as *;

    .conversation-detail {
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;
    }

    .back-link {
      color: $color-primary;
      text-decoration: none;
      font-weight: 500;
    }

    .conversation-header {
      display: flex;
      align-items: center;
      gap: $spacing-md;
    }

    .conversation-header h2 {
      margin: 0;
    }

    .status-badge {
      padding: $spacing-xs $spacing-sm;
      border-radius: $border-radius-sm;
      font-size: $font-size-xs;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.activa {
      background-color: #d4edda;
      color: #155724;
    }

    .status-badge.derivada {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-badge.cerrada {
      background-color: #f8d7da;
      color: #721c24;
    }

    .phone-info {
      background-color: $color-white;
      padding: $spacing-sm $spacing-md;
      border-radius: $border-radius-md;
      box-shadow: $shadow-sm;
    }

    .chat {
      background-color: $color-white;
      border-radius: $border-radius-lg;
      padding: $spacing-lg;
      box-shadow: $shadow-sm;
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
      max-height: 500px;
      overflow-y: auto;
    }

    .message {
      padding: $spacing-sm $spacing-md;
      border-radius: $border-radius-md;
      max-width: 70%;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
    }

    .message p {
      margin: 0;
      white-space: pre-wrap;
    }

    .message small {
      color: lighten($color-text, 25%);
    }

    .bot {
      background-color: $color-secondary;
    }

    .user {
      background-color: $color-primary;
      color: $color-white;
      align-self: flex-end;
    }

    .admin {
      background-color: #e7f3ff;
      border: 2px solid #0066cc;
      align-self: flex-end;
    }

    .role {
      font-size: $font-size-xs;
      color: lighten($color-text, 20%);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .user .role {
      color: rgba(255, 255, 255, 0.8);
    }

    .empty {
      color: lighten($color-text, 20%);
      text-align: center;
    }

    .reply-section,
    .actions-section,
    .summary {
      background-color: $color-white;
      border-radius: $border-radius-lg;
      padding: $spacing-lg;
      box-shadow: $shadow-sm;
    }

    .reply-section h3,
    .actions-section h3,
    .summary h3 {
      margin-top: 0;
      margin-bottom: $spacing-md;
    }

    .reply-form {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
    }

    .reply-form textarea {
      width: 100%;
      padding: $spacing-sm;
      border: 1px solid $color-secondary;
      border-radius: $border-radius-md;
      font-family: inherit;
      font-size: $font-size-base;
      resize: vertical;
    }

    .reply-form textarea:focus {
      outline: none;
      border-color: $color-primary;
    }

    .summary-actions {
      display: flex;
      gap: $spacing-sm;
      flex-wrap: wrap;
    }

    .btn-primary,
    .btn-outline,
    .btn-send,
    .btn-warning {
      padding: $spacing-sm $spacing-md;
      border-radius: $border-radius-md;
      cursor: pointer;
      border: none;
      font-weight: 500;
    }

    .btn-primary,
    .btn-send {
      background-color: $color-primary;
      color: $color-white;
    }

    .btn-primary:disabled,
    .btn-send:disabled {
      background-color: lighten($color-primary, 20%);
      cursor: not-allowed;
    }

    .btn-outline {
      background-color: transparent;
      color: $color-text;
      border: 1px solid $color-secondary;
    }

    .btn-warning {
      background-color: #ffc107;
      color: #212529;
    }

    .error-message {
      color: #dc3545;
      margin-top: $spacing-sm;
    }

    .success-message {
      color: #28a745;
      margin-top: $spacing-sm;
    }
  `]
})
export class ConversationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private conversationService = inject(ConversationService);
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  conversation = signal<Conversation | null>(null);
  replyMessage = '';
  sending = signal(false);
  sendError = signal('');
  sendSuccess = signal(false);

  private readonly FUNCTIONS_BASE_URL = 'https://southamerica-east1-sunset-beauty-spa.cloudfunctions.net';

  ngOnInit(): void {
    this.loadConversation();
  }

  private loadConversation(): void {
    const conversationId = this.route.snapshot.paramMap.get('id');
    if (!conversationId) {
      return;
    }
    this.conversationService.getConversationById(conversationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(conversation => this.conversation.set(conversation ?? null));
  }

  sendMessage(): void {
    const conversationId = this.conversation()?.id;
    if (!conversationId || !this.replyMessage.trim()) {
      return;
    }

    this.sending.set(true);
    this.sendError.set('');
    this.sendSuccess.set(false);

    this.http.post(`${this.FUNCTIONS_BASE_URL}/sendAdminMessage`, {
      conversationId,
      message: this.replyMessage.trim()
    }).subscribe({
      next: () => {
        this.sendSuccess.set(true);
        this.replyMessage = '';
        this.sending.set(false);
        // Recargar conversación para ver el nuevo mensaje
        this.loadConversation();
        // Ocultar mensaje de éxito después de 3 segundos
        setTimeout(() => this.sendSuccess.set(false), 3000);
      },
      error: (err) => {
        console.error('Error sending message:', err);
        this.sendError.set('Error al enviar el mensaje. Intenta de nuevo.');
        this.sending.set(false);
      }
    });
  }

  reactivate(): void {
    const conversationId = this.conversation()?.id;
    if (!conversationId) {
      return;
    }

    this.http.post(`${this.FUNCTIONS_BASE_URL}/reactivateConversation`, {
      conversationId
    }).subscribe({
      next: () => {
        this.loadConversation();
      },
      error: (err) => {
        console.error('Error reactivating conversation:', err);
      }
    });
  }

  markClosed(): void {
    const conversationId = this.conversation()?.id;
    if (!conversationId) {
      return;
    }
    this.conversationService.closeConversation(conversationId).subscribe(() => {
      this.loadConversation();
    });
  }

  markDerived(): void {
    const conversationId = this.conversation()?.id;
    if (!conversationId) {
      return;
    }
    this.conversationService.deriveConversation(conversationId).subscribe(() => {
      this.loadConversation();
    });
  }

  getRoleName(rol: string): string {
    switch (rol) {
      case 'user': return 'Cliente';
      case 'bot': return 'Sofía (Bot)';
      case 'admin': return 'Admin';
      default: return rol;
    }
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
