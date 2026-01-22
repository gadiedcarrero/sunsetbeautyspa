import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="brand">
          <span class="brand-title">Sunset</span>
          <span class="brand-subtitle">Admin</span>
        </div>
        <nav class="nav">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
          <a routerLink="/admin/clientes" routerLinkActive="active">Clientes</a>
          <a routerLink="/admin/conversaciones" routerLinkActive="active">Conversaciones</a>
          <a routerLink="/admin/reservaciones" routerLinkActive="active">Reservaciones</a>
          <a routerLink="/admin/servicios" routerLinkActive="active">Servicios</a>
        </nav>
        <button class="btn-logout" type="button" (click)="onLogout()">Cerrar sesion</button>
      </aside>
      <div class="content">
        <header class="topbar">
          <h1>Panel de Administracion</h1>
        </header>
        <main class="main">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .admin-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      min-height: 100vh;
      background-color: $color-background;
    }

    .sidebar {
      background-color: $color-text;
      color: $color-white;
      padding: $spacing-xl;
      display: flex;
      flex-direction: column;
      gap: $spacing-xl;
    }

    .brand {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      font-family: $font-heading;
    }

    .brand-title {
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
    }

    .brand-subtitle {
      font-size: $font-size-sm;
      color: $color-primary;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .nav {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;

      a {
        color: rgba($color-white, 0.8);
        text-decoration: none;
        padding: $spacing-sm $spacing-md;
        border-radius: $border-radius-md;
        transition: background-color $transition-fast, color $transition-fast;

        &.active,
        &:hover {
          background-color: rgba($color-white, 0.1);
          color: $color-white;
        }
      }
    }

    .btn-logout {
      margin-top: auto;
      border: 1px solid rgba($color-white, 0.3);
      background: transparent;
      color: $color-white;
      padding: $spacing-sm $spacing-md;
      border-radius: $border-radius-md;
      cursor: pointer;
      transition: background-color $transition-fast;

      &:hover {
        background-color: rgba($color-white, 0.1);
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .topbar {
      background-color: $color-white;
      padding: $spacing-lg $spacing-xl;
      box-shadow: $shadow-sm;

      h1 {
        margin: 0;
        font-size: $font-size-lg;
      }
    }

    .main {
      padding: $spacing-xl;
    }

    @include respond-below('lg') {
      .admin-layout {
        grid-template-columns: 1fr;
      }

      .sidebar {
        position: sticky;
        top: 0;
        z-index: $z-index-sticky;
        flex-direction: row;
        align-items: center;
        overflow-x: auto;
      }

      .nav {
        flex-direction: row;
        flex-wrap: nowrap;
      }

      .btn-logout {
        margin-top: 0;
      }
    }
  `]
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/admin/login'])
    });
  }
}
