import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceCardComponent } from '../../shared/components/service-card/service-card.component';
import { SpaServicesService } from '../../core/services/spa-services.service';
import { SpaService } from '../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ServiceCardComponent],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="animate-fade-in-up">Bienvenida a tu oasis de belleza</h1>
        <p class="animate-fade-in-up animate-delay-2">
          Descubre un mundo de relajacion y bienestar donde cada detalle
          esta pensado para consentirte
        </p>
        <div class="hero-buttons animate-fade-in-up animate-delay-3">
          <a routerLink="/reservaciones" class="btn btn--primary btn--lg">
            Reserva tu cita
          </a>
          <a routerLink="/servicios" class="btn btn--outline btn--lg">
            Ver servicios
          </a>
        </div>
      </div>
      <div class="hero-scroll">
        <span>Descubre mas</span>
        <div class="scroll-indicator"></div>
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="section intro">
      <div class="container">
        <div class="intro-content">
          <div class="intro-text">
            <span class="section-label">Bienvenida</span>
            <h2>Un espacio dedicado a tu bienestar</h2>
            <p>
              En Sunset Beauty Spa creemos que cada mujer merece un momento para
              si misma. Nuestro equipo de profesionales esta comprometido con
              brindarte una experiencia unica de relajacion y embellecimiento.
            </p>
            <p>
              Desde tratamientos faciales rejuvenecedores hasta masajes
              relajantes, cada servicio esta disenado para realzar tu belleza
              natural y renovar tu espiritu.
            </p>
            <a routerLink="/nosotros" class="btn btn--primary">Conocenos</a>
          </div>
          <div class="intro-image">
            <div class="image-frame">
              <div class="image-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Services -->
    <section class="section services-section">
      <div class="container">
        <div class="section-title">
          <span class="section-label">Nuestros Servicios</span>
          <h2>Tratamientos destacados</h2>
          <p>Descubre nuestra seleccion de tratamientos mas populares</p>
        </div>

        @if (featuredServices().length > 0) {
          <div class="services-grid">
            @for (service of featuredServices(); track service.id) {
              <app-service-card [service]="service"></app-service-card>
            }
          </div>
        } @else {
          <div class="services-grid">
            @for (service of defaultServices; track service.nombre) {
              <app-service-card [service]="service"></app-service-card>
            }
          </div>
        }

        <div class="text-center mt-4">
          <a routerLink="/servicios" class="btn btn--outline">
            Ver todos los servicios
          </a>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="section why-us">
      <div class="container">
        <div class="section-title">
          <span class="section-label">Por que elegirnos</span>
          <h2>La experiencia Sunset</h2>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3>Atencion personalizada</h3>
            <p>Cada tratamiento se adapta a tus necesidades unicas</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </div>
            <h3>Productos premium</h3>
            <p>Utilizamos solo las mejores marcas del mercado</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>Equipo experto</h3>
            <p>Profesionales certificados y en constante capacitacion</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3>Ambiente relajante</h3>
            <p>Un espacio disenado para tu tranquilidad</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Lista para consentirte?</h2>
          <p>Reserva tu cita hoy y vive la experiencia Sunset Beauty Spa</p>
          <a routerLink="/reservaciones" class="btn btn--primary btn--lg">
            Reservar ahora
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    // Hero Section
    .hero {
      position: relative;
      height: 100vh;
      min-height: 600px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, $color-secondary 0%, darken($color-secondary, 10%) 100%);
      overflow: hidden;

      &-overlay {
        @include overlay(0.3);
        background: linear-gradient(to bottom, transparent 50%, rgba($color-text, 0.3) 100%);
      }

      &-content {
        position: relative;
        z-index: 1;
        text-align: center;
        max-width: 800px;
        padding: 0 $spacing-xl;

        h1 {
          font-size: $font-size-4xl;
          color: $color-text;
          margin-bottom: $spacing-lg;

          @include respond-below('md') {
            font-size: $font-size-2xl;
          }
        }

        p {
          font-size: $font-size-lg;
          color: lighten($color-text, 10%);
          margin-bottom: $spacing-xl;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;

          @include respond-below('md') {
            font-size: $font-size-base;
          }
        }
      }

      &-buttons {
        display: flex;
        gap: $spacing-md;
        justify-content: center;
        flex-wrap: wrap;

        .btn--outline {
          background-color: transparent;
          border-color: $color-text;
          color: $color-text;

          &:hover {
            background-color: $color-text;
            color: $color-white;
          }
        }
      }

      &-scroll {
        position: absolute;
        bottom: $spacing-2xl;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;

        span {
          display: block;
          font-size: $font-size-sm;
          color: $color-text;
          margin-bottom: $spacing-sm;
        }

        .scroll-indicator {
          width: 24px;
          height: 40px;
          border: 2px solid $color-text;
          border-radius: 12px;
          margin: 0 auto;
          position: relative;

          &::after {
            content: '';
            position: absolute;
            top: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 8px;
            background-color: $color-primary;
            border-radius: 2px;
            animation: scroll 2s infinite;
          }
        }
      }
    }

    @keyframes scroll {
      0%, 100% { opacity: 1; transform: translateX(-50%) translateY(0); }
      50% { opacity: 0.5; transform: translateX(-50%) translateY(10px); }
    }

    // Introduction Section
    .intro {
      background-color: $color-white;

      &-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: $spacing-3xl;
        align-items: center;

        @include respond-below('lg') {
          grid-template-columns: 1fr;
        }
      }

      &-text {
        .section-label {
          display: inline-block;
          font-size: $font-size-sm;
          font-weight: $font-weight-medium;
          color: $color-primary;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: $spacing-md;
        }

        h2 {
          font-size: $font-size-3xl;
          margin-bottom: $spacing-lg;

          @include respond-below('md') {
            font-size: $font-size-2xl;
          }
        }

        p {
          color: lighten($color-text, 15%);
          margin-bottom: $spacing-md;
        }

        .btn {
          margin-top: $spacing-md;
        }
      }

      &-image {
        @include respond-below('lg') {
          display: none;
        }

        .image-frame {
          position: relative;
          border-radius: $border-radius-lg;
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            top: -20px;
            right: -20px;
            width: 100%;
            height: 100%;
            border: 2px solid $color-primary;
            border-radius: $border-radius-lg;
            z-index: -1;
          }
        }

        .image-placeholder {
          @include flex-center;
          height: 400px;
          background-color: $color-secondary;
          color: $color-primary;
          border-radius: $border-radius-lg;
        }
      }
    }

    // Services Section
    .services-section {
      background-color: $color-background;

      .section-label {
        display: block;
        font-size: $font-size-sm;
        font-weight: $font-weight-medium;
        color: $color-primary;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: $spacing-sm;
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

    // Why Us Section
    .why-us {
      background-color: $color-white;

      .section-label {
        display: block;
        font-size: $font-size-sm;
        font-weight: $font-weight-medium;
        color: $color-primary;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: $spacing-sm;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: $spacing-xl;

      @include respond-below('lg') {
        grid-template-columns: repeat(2, 1fr);
      }

      @include respond-below('sm') {
        grid-template-columns: 1fr;
      }
    }

    .feature-card {
      text-align: center;
      padding: $spacing-xl;
      border-radius: $border-radius-lg;
      transition: all $transition-base;

      &:hover {
        background-color: $color-secondary;
        transform: translateY(-5px);
      }

      .feature-icon {
        @include flex-center;
        width: 70px;
        height: 70px;
        margin: 0 auto $spacing-lg;
        background-color: $color-secondary;
        border-radius: $border-radius-full;
        color: $color-primary;
        transition: all $transition-base;
      }

      &:hover .feature-icon {
        background-color: $color-primary;
        color: $color-white;
      }

      h3 {
        font-size: $font-size-lg;
        margin-bottom: $spacing-sm;
      }

      p {
        color: lighten($color-text, 20%);
        font-size: $font-size-sm;
        margin: 0;
      }
    }

    // CTA Section
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
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .btn {
          background-color: $color-white;
          color: $color-primary;

          &:hover {
            background-color: $color-secondary;
            transform: translateY(-2px);
          }
        }
      }
    }

    .container {
      @include container;
    }

    .section-title {
      text-align: center;
      margin-bottom: $spacing-2xl;
    }
  `]
})
export class HomeComponent implements OnInit {
  private spaServicesService = inject(SpaServicesService);
  featuredServices = signal<SpaService[]>([]);

  defaultServices: SpaService[] = [
    {
      nombre: 'Facial Rejuvenecedor',
      descripcion: 'Tratamiento facial completo que hidrata, nutre y rejuvenece tu piel dejandola radiante.',
      categoria: 'facial',
      duracion: '60 min',
      precio: 85,
      activo: true
    },
    {
      nombre: 'Masaje Relajante',
      descripcion: 'Masaje corporal completo que alivia tensiones y te transporta a un estado de total relajacion.',
      categoria: 'masajes',
      duracion: '90 min',
      precio: 95,
      activo: true
    },
    {
      nombre: 'Manicure Spa',
      descripcion: 'Tratamiento completo para tus manos que incluye exfoliacion, hidratacion y esmaltado.',
      categoria: 'unas',
      duracion: '45 min',
      precio: 35,
      activo: true
    }
  ];

  ngOnInit(): void {
    this.spaServicesService.getActiveServices().subscribe(services => {
      this.featuredServices.set(services.slice(0, 3));
    });
  }
}
