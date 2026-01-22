import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="logo">
              <span class="logo-text">Sunset</span>
              <span class="logo-accent">Beauty Spa</span>
            </div>
            <p class="tagline">Tu oasis de belleza y relajacion</p>
            <div class="social-links">
              <a href="#" aria-label="Facebook" class="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" class="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          <div class="footer-links">
            <h4>Enlaces</h4>
            <ul>
              <li><a routerLink="/">Inicio</a></li>
              <li><a routerLink="/nosotros">Nosotros</a></li>
              <li><a routerLink="/servicios">Servicios</a></li>
              <li><a routerLink="/galeria">Galeria</a></li>
            </ul>
          </div>

          <div class="footer-links">
            <h4>Servicios</h4>
            <ul>
              <li><a routerLink="/servicios">Tratamientos Faciales</a></li>
              <li><a routerLink="/servicios">Masajes</a></li>
              <li><a routerLink="/servicios">Tratamientos Corporales</a></li>
              <li><a routerLink="/servicios">Manicure & Pedicure</a></li>
            </ul>
          </div>

          <div class="footer-contact">
            <h4>Contacto</h4>
            <ul>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Calle Principal #123, Ciudad</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>+1 234 567 8900</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>info&#64;sunsetbeautyspa.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} Sunset Beauty Spa. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .footer {
      background-color: $color-text;
      color: $color-white;
      padding: $spacing-3xl 0 $spacing-lg;
    }

    .container {
      @include container;
    }

    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
      gap: $spacing-2xl;
      margin-bottom: $spacing-2xl;

      @include respond-below('lg') {
        grid-template-columns: repeat(2, 1fr);
      }

      @include respond-below('md') {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }

    .footer-brand {
      .logo {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
        margin-bottom: $spacing-md;

        @include respond-below('md') {
          align-items: center;
        }

        .logo-text {
          font-family: $font-heading;
          font-size: $font-size-xl;
          font-weight: $font-weight-bold;
          color: $color-white;
        }

        .logo-accent {
          font-family: $font-heading;
          font-size: $font-size-sm;
          color: $color-primary;
          letter-spacing: 2px;
        }
      }

      .tagline {
        color: rgba($color-white, 0.7);
        margin-bottom: $spacing-lg;
      }
    }

    .social-links {
      display: flex;
      gap: $spacing-md;

      @include respond-below('md') {
        justify-content: center;
      }

      .social-link {
        @include flex-center;
        width: 40px;
        height: 40px;
        border-radius: $border-radius-full;
        background-color: rgba($color-white, 0.1);
        color: $color-white;
        transition: all $transition-fast;

        &:hover {
          background-color: $color-primary;
          transform: translateY(-3px);
        }
      }
    }

    .footer-links {
      h4 {
        font-family: $font-heading;
        font-size: $font-size-md;
        font-weight: $font-weight-semibold;
        color: $color-white;
        margin-bottom: $spacing-lg;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: $spacing-sm;

          a {
            color: rgba($color-white, 0.7);
            text-decoration: none;
            transition: color $transition-fast;

            &:hover {
              color: $color-primary;
            }
          }
        }
      }
    }

    .footer-contact {
      h4 {
        font-family: $font-heading;
        font-size: $font-size-md;
        font-weight: $font-weight-semibold;
        color: $color-white;
        margin-bottom: $spacing-lg;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          display: flex;
          align-items: flex-start;
          gap: $spacing-sm;
          margin-bottom: $spacing-md;
          color: rgba($color-white, 0.7);

          @include respond-below('md') {
            justify-content: center;
          }

          svg {
            flex-shrink: 0;
            margin-top: 2px;
            color: $color-primary;
          }
        }
      }
    }

    .footer-bottom {
      padding-top: $spacing-lg;
      border-top: 1px solid rgba($color-white, 0.1);
      text-align: center;

      p {
        color: rgba($color-white, 0.5);
        font-size: $font-size-sm;
        margin: 0;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
