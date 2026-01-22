import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConversationService } from '../../../core/services/conversation.service';
import { Conversation } from '../../../core/models';

@Component({
  selector: 'app-admin-conversations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="conversations">
      <div class="header">
        <h2>Conversaciones</h2>
        <select class="filter" (change)="setStatusFilter($any($event.target).value)">
          <option value="all">Todas</option>
          <option value="activa">Activas</option>
          <option value="cerrada">Cerradas</option>
          <option value="derivada">Derivadas</option>
        </select>
      </div>
      <div class="list">
        @for (conversation of filteredConversations(); track conversation.id) {
          <div class="item">
            <div>
              <strong>{{ conversation.telefono }}</strong>
              <p>Ultimo mensaje: {{ formatDate(conversation.fechaUltimoMensaje) }}</p>
            </div>
            <a [routerLink]="['/admin/conversaciones', conversation.id]">Abrir</a>
          </div>
        } @empty {
          <div class="empty">No hay conversaciones.</div>
        }
      </div>
    </section>
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .conversations {
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

    .filter {
      padding: $spacing-sm $spacing-md;
      border-radius: $border-radius-md;
      border: 1px solid $color-secondary;
    }

    .list {
      background-color: $color-white;
      border-radius: $border-radius-lg;
      box-shadow: $shadow-sm;
      padding: $spacing-md;
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
    }

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid $color-secondary;
      padding-bottom: $spacing-md;
    }

    .item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .note {
      color: lighten($color-text, 20%);
      font-size: $font-size-sm;
    }

    .empty {
      color: lighten($color-text, 20%);
      text-align: center;
      padding: $spacing-lg 0;
    }
  `]
})
export class ConversationsComponent implements OnInit {
  private conversationService = inject(ConversationService);
  private destroyRef = inject(DestroyRef);

  conversations = signal<Conversation[]>([]);
  selectedStatus = signal<'all' | Conversation['estado']>('all');

  filteredConversations = computed(() => {
    const status = this.selectedStatus();
    if (status === 'all') {
      return this.conversations();
    }
    return this.conversations().filter(c => c.estado === status);
  });

  ngOnInit(): void {
    this.conversationService.getAllConversations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(conversations => this.conversations.set(conversations));
  }

  setStatusFilter(status: 'all' | Conversation['estado']): void {
    this.selectedStatus.set(status);
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
