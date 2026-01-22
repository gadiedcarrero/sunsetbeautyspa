import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { WhatsappButtonComponent } from './shared/components/whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    WhatsappButtonComponent
  ],
  template: `
    @if (!isAdminRoute) {
      <app-header></app-header>
    }
    <main [class.admin-main]="isAdminRoute">
      <router-outlet></router-outlet>
    </main>
    @if (!isAdminRoute) {
      <app-footer></app-footer>
      <app-whatsapp-button></app-whatsapp-button>
    }
  `,
  styles: [`
    main {
      min-height: 100vh;

      &.admin-main {
        background-color: #f5f5f5;
      }
    }
  `]
})
export class AppComponent {
  isAdminRoute = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects)
    ).subscribe(url => {
      this.isAdminRoute = url.startsWith('/admin');
    });
  }
}
