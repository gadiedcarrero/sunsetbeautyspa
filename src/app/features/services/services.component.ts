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
          @for (service of filteredServices(); track service.id || service.nombre) {
            <app-service-card [service]="service"></app-service-card>
          } @empty {
            @for (service of defaultServices; track service.nombre) {
              <app-service-card [service]="service"></app-service-card>
            }
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

  defaultServices: SpaService[] = [
    {
      nombre: 'Facial Rejuvenecedor',
      descripcion: 'Tratamiento facial completo que hidrata, nutre y rejuvenece tu piel dejandola radiante y luminosa.',
      categoria: 'facial',
      duracion: '60 min',
      precio: 85,
      activo: true
    },
    {
      nombre: 'Limpieza Facial Profunda',
      descripcion: 'Limpieza profesional que elimina impurezas y puntos negros, dejando tu piel fresca y limpia.',
      categoria: 'facial',
      duracion: '45 min',
      precio: 65,
      activo: true
    },
    {
      nombre: 'Masaje Relajante',
      descripcion: 'Masaje corporal completo que alivia tensiones musculares y te transporta a un estado de relajacion total.',
      categoria: 'masajes',
      duracion: '90 min',
      precio: 95,
      activo: true
    },
    {
      nombre: 'Masaje con Piedras Calientes',
      descripcion: 'Terapia que combina masaje tradicional con piedras volcanicas calientes para una relajacion profunda.',
      categoria: 'masajes',
      duracion: '75 min',
      precio: 110,
      activo: true
    },
    {
      nombre: 'Tratamiento Corporal Reductor',
      descripcion: 'Tratamiento especializado que ayuda a reducir medidas y mejorar la apariencia de la piel.',
      categoria: 'corporal',
      duracion: '60 min',
      precio: 90,
      activo: true
    },
    {
      nombre: 'Exfoliacion Corporal',
      descripcion: 'Renovacion celular completa que deja tu piel suave, tersa y radiante.',
      categoria: 'corporal',
      duracion: '45 min',
      precio: 70,
      activo: true
    },
    {
      nombre: 'Manicure Spa',
      descripcion: 'Tratamiento completo para tus manos que incluye exfoliacion, hidratacion profunda y esmaltado.',
      categoria: 'unas',
      duracion: '45 min',
      precio: 35,
      activo: true
    },
    {
      nombre: 'Pedicure Spa',
      descripcion: 'Cuidado completo para tus pies con exfoliacion, masaje relajante y esmaltado de tu eleccion.',
      categoria: 'unas',
      duracion: '60 min',
      precio: 45,
      activo: true
    },
    {
      nombre: 'Depilacion con Cera',
      descripcion: 'Depilacion profesional con cera tibia para una piel suave y libre de vello por mas tiempo.',
      categoria: 'depilacion',
      duracion: '30-60 min',
      precio: 25,
      activo: true
    }
  ];

  filteredServices = computed(() => {
    const allServices = this.services().length > 0 ? this.services() : this.defaultServices;
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
