import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceCardComponent } from '../../shared/components/service-card/service-card.component';
import { SpaServicesService } from '../../core/services/spa-services.service';
import { SpaService } from '../../core/models';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, ServiceCardComponent],
  template: `
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <h1>Nuestros Servicios</h1>
        <p>Descubre todos los tratamientos que tenemos para ti</p>
      </div>
    </section>

    <!-- Services Section -->
    <section class="section services">
      <div class="container">
        <!-- Category Filters -->
        <div class="filters">
          <button
            class="filter-btn"
            [class.active]="selectedCategory() === 'all'"
            (click)="setCategory('all')"
          >
            Todos
          </button>
          @for (category of categories; track category.value) {
            <button
              class="filter-btn"
              [class.active]="selectedCategory() === category.value"
              (click)="setCategory(category.value)"
            >
              {{ category.label }}
            </button>
          }
        </div>

        <!-- Services Grid -->
        <div class="services-grid">
          @for (service of filteredServices(); track service.id) {
            <app-service-card [service]="service"></app-service-card>
          } @empty {
            <p class="no-services">No hay servicios disponibles en esta categoria</p>
          }
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>No encuentras lo que buscas?</h2>
          <p>Contactanos y te ayudaremos a encontrar el tratamiento perfecto para ti</p>
          <a routerLink="/contacto" class="btn btn--primary btn--lg">
            Contactanos
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .page-header {
      background: linear-gradient(135deg, $color-secondary 0%, darken($color-secondary, 5%) 100%);
      padding: calc($spacing-3xl + 80px) 0 $spacing-3xl;
      text-align: center;

      h1 {
        font-size: $font-size-4xl;
        margin-bottom: $spacing-md;

        @include respond-below('md') {
          font-size: $font-size-2xl;
        }
      }

      p {
        font-size: $font-size-lg;
        color: lighten($color-text, 15%);
        max-width: 500px;
        margin: 0 auto;
      }
    }

    .container {
      @include container;
    }

    .services {
      background-color: $color-background;
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: $spacing-sm;
      margin-bottom: $spacing-2xl;

      .filter-btn {
        padding: $spacing-sm $spacing-lg;
        background-color: $color-white;
        border: 2px solid $color-secondary;
        border-radius: $border-radius-full;
        font-family: $font-body;
        font-size: $font-size-sm;
        font-weight: $font-weight-medium;
        color: $color-text;
        cursor: pointer;
        transition: all $transition-fast;

        &:hover {
          border-color: $color-primary;
          color: $color-primary;
        }

        &.active {
          background-color: $color-primary;
          border-color: $color-primary;
          color: $color-white;
        }
      }
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $spacing-xl;

      @include respond-below('lg') {
        grid-template-columns: repeat(2, 1fr);
      }

      @include respond-below('md') {
        grid-template-columns: 1fr;
      }
    }

    .no-services {
      grid-column: 1 / -1;
      text-align: center;
      color: lighten($color-text, 30%);
      font-style: italic;
      padding: $spacing-2xl;
    }

    .cta-section {
      background: linear-gradient(135deg, $color-primary 0%, darken($color-primary, 15%) 100%);
      padding: $spacing-3xl 0;

      .cta-content {
        text-align: center;

        h2 {
          color: $color-white;
          font-size: $font-size-3xl;
          margin-bottom: $spacing-md;

          @include respond-below('md') {
            font-size: $font-size-2xl;
          }
        }

        p {
          color: rgba($color-white, 0.9);
          font-size: $font-size-lg;
          margin-bottom: $spacing-xl;
        }

        .btn {
          background-color: $color-white;
          color: $color-primary;

          &:hover {
            background-color: $color-secondary;
          }
        }
      }
    }
  `]
})
export class ServicesComponent implements OnInit {
  private spaServicesService = inject(SpaServicesService);

  services = signal<SpaService[]>([]);
  selectedCategory = signal<string>('all');

  categories = [
    { value: 'facial', label: 'Facial' },
    { value: 'corporal', label: 'Corporal' },
    { value: 'masajes', label: 'Masajes' },
    { value: 'unas', label: 'Unas' },
    { value: 'depilacion', label: 'Depilacion' }
  ];

  filteredServices = computed(() => {
    const allServices = this.services();
    if (this.selectedCategory() === 'all') {
      return allServices;
    }
    return allServices.filter(s => s.categoria === this.selectedCategory());
  });

  ngOnInit(): void {
    this.spaServicesService.getActiveServices().subscribe(services => {
      this.services.set(services);
    });
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
