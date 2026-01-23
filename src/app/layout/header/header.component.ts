import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header" [class.scrolled]="isScrolled()">
      <div class="container">
        <nav class="nav">
          <a routerLink="/" class="logo">
            <img src="/Sunset_logo.png" alt="Sunset Beauty Spa" class="logo-img" />
          </a>

          <button
            class="nav-toggle"
            [class.active]="isMenuOpen()"
            (click)="toggleMenu()"
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul class="nav-menu" [class.active]="isMenuOpen()">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">Inicio</a></li>
            <li><a routerLink="/nosotros" routerLinkActive="active" (click)="closeMenu()">Nosotros</a></li>
            <li><a routerLink="/servicios" routerLinkActive="active" (click)="closeMenu()">Servicios</a></li>
            <li><a routerLink="/galeria" routerLinkActive="active" (click)="closeMenu()">Galeria</a></li>
            <li><a routerLink="/reservaciones" routerLinkActive="active" (click)="closeMenu()">Reservaciones</a></li>
            <li><a routerLink="/contacto" routerLinkActive="active" (click)="closeMenu()">Contacto</a></li>
          </ul>

          <a routerLink="/reservaciones" class="btn-reservar hidden-mobile">
            Reservar Cita
          </a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: $z-index-fixed;
      background-color: transparent;
      transition: all $transition-base;
      padding: $spacing-md 0;

      &.scrolled {
        background-color: rgba($color-white, 0.98);
        box-shadow: $shadow-sm;
        padding: $spacing-sm 0;
      }
    }

    .container {
      @include container;
      position: relative;
    }

    .nav {
      @include flex-between;

      @include respond-below('lg') {
        flex-wrap: wrap;
        justify-content: center;
      }
    }

    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;

      @include respond-below('lg') {
        order: 1;
        width: 100%;
        justify-content: center;
        margin-bottom: $spacing-sm;
      }

      .logo-img {
        height: 200px;
        width: auto;
        transition: height $transition-base;
        filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15));

        @include respond-below('lg') {
          height: 120px;
        }
      }
    }

    .header.scrolled .logo-img {
      height: 80px;

      @include respond-below('lg') {
        height: 60px;
      }
    }

    .nav-toggle {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 28px;
      height: 20px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;

      @include respond-below('lg') {
        display: flex;
        position: absolute;
        right: $spacing-lg;
        top: $spacing-lg;
      }

      span {
        display: block;
        width: 100%;
        height: 2px;
        background-color: $color-text;
        transition: all $transition-fast;
      }

      &.active {
        span:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }
        span:nth-child(2) {
          opacity: 0;
        }
        span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }
      }
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: $spacing-xl;
      list-style: none;
      margin: 0;
      padding: 0;

      @include respond-below('lg') {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        bottom: 0;
        flex-direction: column;
        justify-content: flex-start;
        padding-top: $spacing-2xl;
        gap: $spacing-lg;
        background-color: $color-white;
        transform: translateX(100%);
        transition: transform $transition-base;

        &.active {
          transform: translateX(0);
        }
      }

      a {
        font-family: $font-body;
        font-size: $font-size-base;
        font-weight: $font-weight-medium;
        color: $color-text;
        text-decoration: none;
        position: relative;
        transition: color $transition-fast;

        &::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: $color-primary;
          transition: width $transition-fast;
        }

        &:hover,
        &.active {
          color: $color-primary;

          &::after {
            width: 100%;
          }
        }

        @include respond-below('lg') {
          font-size: $font-size-lg;
        }
      }
    }

    .btn-reservar {
      @include button-primary;
      font-size: $font-size-sm;
      padding: $spacing-sm $spacing-lg;
    }

    .hidden-mobile {
      @include respond-below('lg') {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  isMenuOpen = signal(false);
  isScrolled = signal(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
