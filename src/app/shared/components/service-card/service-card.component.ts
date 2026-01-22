import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpaService } from '../../../core/models';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <article class="service-card">
      <div class="service-image">
        @if (service.imagen) {
          <img [src]="service.imagen" [alt]="service.nombre">
        } @else {
          <div class="image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        }
        <span class="category-badge">{{ getCategoryLabel(service.categoria) }}</span>
      </div>
      <div class="service-content">
        <h3 class="service-title">{{ service.nombre }}</h3>
        <p class="service-description">{{ service.descripcion }}</p>
        <div class="service-meta">
          @if (service.duracion) {
            <span class="duration">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ service.duracion }}
            </span>
          }
          @if (service.precio) {
            <span class="price">Desde \${{ service.precio }}</span>
          }
        </div>
        @if (showButton) {
          <a routerLink="/reservaciones" class="btn-reservar">Reservar</a>
        }
      </div>
    </article>
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .service-card {
      @include card;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .service-image {
      position: relative;
      height: 200px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform $transition-slow;
      }

      .service-card:hover & img {
        transform: scale(1.05);
      }

      .image-placeholder {
        @include flex-center;
        width: 100%;
        height: 100%;
        background-color: $color-secondary;
        color: $color-primary;
      }

      .category-badge {
        position: absolute;
        top: $spacing-md;
        left: $spacing-md;
        padding: $spacing-xs $spacing-sm;
        background-color: $color-primary;
        color: $color-white;
        font-size: $font-size-xs;
        font-weight: $font-weight-medium;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-radius: $border-radius-sm;
      }
    }

    .service-content {
      padding: $spacing-lg;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .service-title {
      font-family: $font-heading;
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      color: $color-text;
      margin-bottom: $spacing-sm;
    }

    .service-description {
      color: lighten($color-text, 20%);
      font-size: $font-size-sm;
      line-height: 1.6;
      margin-bottom: $spacing-md;
      flex-grow: 1;
      @include truncate(3);
    }

    .service-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: $spacing-md;
      padding-top: $spacing-md;
      border-top: 1px solid $color-secondary;

      .duration {
        display: flex;
        align-items: center;
        gap: $spacing-xs;
        color: lighten($color-text, 20%);
        font-size: $font-size-sm;

        svg {
          color: $color-primary;
        }
      }

      .price {
        font-weight: $font-weight-semibold;
        color: $color-primary;
      }
    }

    .btn-reservar {
      @include button-primary;
      width: 100%;
      text-align: center;
    }
  `]
})
export class ServiceCardComponent {
  @Input({ required: true }) service!: SpaService;
  @Input() showButton = true;

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'facial': 'Facial',
      'corporal': 'Corporal',
      'masajes': 'Masajes',
      'unas': 'Unas',
      'depilacion': 'Depilacion',
      'otros': 'Otros'
    };
    return labels[category] || category;
  }
}
