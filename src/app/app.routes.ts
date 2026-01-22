import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'servicios',
    loadComponent: () => import('./features/services/services.component').then(m => m.ServicesComponent)
  },
  {
    path: 'galeria',
    loadComponent: () => import('./features/gallery/gallery.component').then(m => m.GalleryComponent)
  },
  {
    path: 'reservaciones',
    loadComponent: () => import('./features/reservations/reservations.component').then(m => m.ReservationsComponent)
  },
  {
    path: 'contacto',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'admin/login',
    canActivate: [publicGuard],
    loadComponent: () => import('./features/admin/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./features/admin/clients/clients.component').then(m => m.ClientsComponent)
      },
      {
        path: 'clientes/:id',
        loadComponent: () => import('./features/admin/clients/client-detail/client-detail.component').then(m => m.ClientDetailComponent)
      },
      {
        path: 'conversaciones',
        loadComponent: () => import('./features/admin/conversations/conversations.component').then(m => m.ConversationsComponent)
      },
      {
        path: 'conversaciones/:id',
        loadComponent: () => import('./features/admin/conversations/conversation-detail/conversation-detail.component').then(m => m.ConversationDetailComponent)
      },
      {
        path: 'reservaciones',
        loadComponent: () => import('./features/admin/reservations/reservations.component').then(m => m.AdminReservationsComponent)
      },
      {
        path: 'servicios',
        loadComponent: () => import('./features/admin/services/services.component').then(m => m.AdminServicesComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
