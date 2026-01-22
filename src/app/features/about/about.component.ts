import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <h1>Sobre Nosotros</h1>
        <p>Conoce nuestra historia y pasion por la belleza</p>
      </div>
    </section>

    <!-- Story Section -->
    <section class="section story">
      <div class="container">
        <div class="story-content">
          <div class="story-image">
            <div class="image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
          </div>
          <div class="story-text">
            <span class="section-label">Nuestra Historia</span>
            <h2>Un sueno hecho realidad</h2>
            <p>
              Sunset Beauty Spa nacio de la pasion por la belleza y el bienestar
              femenino. Fundado en 2015, nuestro spa se ha convertido en un
              refugio donde las mujeres pueden desconectarse del estres diario
              y reconectarse consigo mismas.
            </p>
            <p>
              Lo que comenzo como un pequeno salon de belleza, hoy es un
              completo centro de bienestar donde cada detalle esta pensado
              para brindarte una experiencia unica e inolvidable.
            </p>
            <p>
              Creemos que cada mujer merece sentirse hermosa y especial.
              Por eso, nos dedicamos a ofrecer tratamientos de la mas alta
              calidad en un ambiente calido y acogedor.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="section mission-vision">
      <div class="container">
        <div class="mv-grid">
          <div class="mv-card">
            <div class="mv-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <h3>Nuestra Mision</h3>
            <p>
              Brindar experiencias de belleza y bienestar excepcionales que
              realcen la belleza natural de cada mujer, utilizando productos
              de la mas alta calidad y tecnicas innovadoras, en un ambiente
              de calidez y profesionalismo.
            </p>
          </div>
          <div class="mv-card">
            <div class="mv-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <h3>Nuestra Vision</h3>
            <p>
              Ser el spa de referencia en la region, reconocido por la
              excelencia en nuestros servicios, la innovacion constante y
              el compromiso genuino con el bienestar y satisfaccion de
              cada una de nuestras clientas.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="section values">
      <div class="container">
        <div class="section-title">
          <span class="section-label">Lo que nos define</span>
          <h2>Nuestros Valores</h2>
        </div>

        <div class="values-grid">
          <div class="value-item">
            <div class="value-number">01</div>
            <h4>Excelencia</h4>
            <p>Nos esforzamos por superar expectativas en cada servicio</p>
          </div>
          <div class="value-item">
            <div class="value-number">02</div>
            <h4>Calidez</h4>
            <p>Creamos un ambiente acogedor donde te sientas como en casa</p>
          </div>
          <div class="value-item">
            <div class="value-number">03</div>
            <h4>Profesionalismo</h4>
            <p>Equipo altamente capacitado y en constante formacion</p>
          </div>
          <div class="value-item">
            <div class="value-number">04</div>
            <h4>Innovacion</h4>
            <p>Siempre a la vanguardia en tecnicas y tratamientos</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="section team">
      <div class="container">
        <div class="section-title">
          <span class="section-label">Nuestro Equipo</span>
          <h2>Profesionales apasionados</h2>
          <p>Conoce a las expertas que haran de tu visita una experiencia inolvidable</p>
        </div>

        <div class="team-grid">
          <div class="team-member">
            <div class="member-photo">
              <div class="photo-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
            <h4>Maria Garcia</h4>
            <span class="role">Directora & Fundadora</span>
            <p>Con mas de 15 anos de experiencia en el mundo de la belleza</p>
          </div>
          <div class="team-member">
            <div class="member-photo">
              <div class="photo-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
            <h4>Ana Martinez</h4>
            <span class="role">Especialista Facial</span>
            <p>Experta en tratamientos rejuvenecedores y cuidado de la piel</p>
          </div>
          <div class="team-member">
            <div class="member-photo">
              <div class="photo-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
            <h4>Laura Rodriguez</h4>
            <span class="role">Masajista Profesional</span>
            <p>Certificada en multiples tecnicas de masaje terapeutico</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ven a conocernos</h2>
          <p>Agenda tu primera visita y descubre todo lo que tenemos para ti</p>
          <a routerLink="/reservaciones" class="btn btn--primary btn--lg">
            Reservar cita
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

    .section-label {
      display: inline-block;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      color: $color-primary;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: $spacing-md;
    }

    // Story Section
    .story {
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

      &-image {
        @include respond-below('lg') {
          order: 2;
        }

        .image-placeholder {
          @include flex-center;
          height: 400px;
          background-color: $color-secondary;
          color: $color-primary;
          border-radius: $border-radius-lg;
        }
      }

      &-text {
        @include respond-below('lg') {
          order: 1;
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
      }
    }

    // Mission & Vision
    .mission-vision {
      background-color: $color-background;

      .mv-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: $spacing-xl;

        @include respond-below('md') {
          grid-template-columns: 1fr;
        }
      }

      .mv-card {
        background-color: $color-white;
        padding: $spacing-2xl;
        border-radius: $border-radius-lg;
        text-align: center;
        box-shadow: $shadow-md;

        .mv-icon {
          @include flex-center;
          width: 80px;
          height: 80px;
          margin: 0 auto $spacing-lg;
          background-color: $color-secondary;
          border-radius: $border-radius-full;
          color: $color-primary;
        }

        h3 {
          font-size: $font-size-xl;
          margin-bottom: $spacing-md;
        }

        p {
          color: lighten($color-text, 15%);
          margin: 0;
        }
      }
    }

    // Values Section
    .values {
      background-color: $color-white;

      .section-title {
        text-align: center;
        margin-bottom: $spacing-2xl;
      }

      .values-grid {
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

      .value-item {
        text-align: center;
        padding: $spacing-lg;

        .value-number {
          font-family: $font-heading;
          font-size: $font-size-3xl;
          font-weight: $font-weight-bold;
          color: $color-secondary;
          margin-bottom: $spacing-md;
        }

        h4 {
          font-size: $font-size-lg;
          margin-bottom: $spacing-sm;
        }

        p {
          color: lighten($color-text, 20%);
          font-size: $font-size-sm;
          margin: 0;
        }
      }
    }

    // Team Section
    .team {
      background-color: $color-background;

      .section-title {
        text-align: center;
        margin-bottom: $spacing-2xl;

        p {
          color: lighten($color-text, 15%);
          max-width: 500px;
          margin: $spacing-md auto 0;
        }
      }

      .team-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: $spacing-xl;

        @include respond-below('lg') {
          grid-template-columns: repeat(2, 1fr);
        }

        @include respond-below('sm') {
          grid-template-columns: 1fr;
        }
      }

      .team-member {
        text-align: center;
        background-color: $color-white;
        padding: $spacing-xl;
        border-radius: $border-radius-lg;
        box-shadow: $shadow-md;

        .member-photo {
          margin-bottom: $spacing-lg;

          .photo-placeholder {
            @include flex-center;
            width: 120px;
            height: 120px;
            margin: 0 auto;
            background-color: $color-secondary;
            border-radius: $border-radius-full;
            color: $color-primary;
          }
        }

        h4 {
          font-size: $font-size-lg;
          margin-bottom: $spacing-xs;
        }

        .role {
          display: block;
          font-size: $font-size-sm;
          color: $color-primary;
          font-weight: $font-weight-medium;
          margin-bottom: $spacing-md;
        }

        p {
          color: lighten($color-text, 20%);
          font-size: $font-size-sm;
          margin: 0;
        }
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
export class AboutComponent {}
