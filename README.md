# Sunset Beauty Spa

Aplicacion web completa para gestion de spa con sistema de reservaciones y panel de administracion.

**URL de Produccion:** https://sunsetbeautyspa.com

---

## Stack Tecnologico

| Tecnologia | Proposito |
|------------|-----------|
| Angular 19 | Framework frontend (Standalone Components + Signals) |
| Firebase Firestore | Base de datos NoSQL |
| Firebase Auth | Autenticacion |
| Firebase Storage | Almacenamiento de imagenes |
| Vercel | Hosting y deploy |
| SCSS | Estilos con variables y mixins |

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Nucleo de la aplicacion
│   │   ├── models/              # Interfaces TypeScript
│   │   ├── services/            # Servicios Firebase
│   │   └── guards/              # Auth guards
│   │
│   ├── features/                # Modulos por funcionalidad
│   │   ├── home/                # Pagina principal
│   │   ├── services/            # Catalogo de servicios
│   │   ├── reservations/        # Sistema de reservaciones
│   │   ├── about/               # Nosotros
│   │   ├── contact/             # Contacto
│   │   ├── gallery/             # Galeria
│   │   └── admin/               # Panel de administracion
│   │       ├── dashboard/
│   │       ├── services/        # CRUD de servicios
│   │       ├── reservations/
│   │       ├── clients/
│   │       └── conversations/
│   │
│   ├── layout/                  # Header y Footer
│   └── shared/                  # Componentes reutilizables
│       └── components/
│           ├── service-card/
│           └── image-upload/
│
├── environments/                # Variables de entorno
│   ├── environment.ts           # Desarrollo
│   └── environment.prod.ts      # Produccion
│
└── styles/                      # Estilos globales SCSS
    ├── _variables.scss
    └── _mixins.scss
```

---

## Modelos de Datos

### SpaService (Servicios)
```typescript
interface SpaService {
  id?: string;
  nombre: string;
  descripcion: string;
  precio?: number;
  duracion: string;
  categoria: 'facial' | 'corporal' | 'masajes' | 'unas' | 'depilacion' | 'otros';
  imagen?: string;
  activo: boolean;
  destacado?: boolean;  // Para mostrar en portada (max 3)
}
```

### Reservation (Reservaciones)
```typescript
interface Reservation {
  id?: string;
  clienteId?: string;
  nombre: string;
  telefono: string;
  email?: string;
  servicio: string;
  fechaSolicitada: string;
  horaSolicitada: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  notas?: string;
  fechaCreacion: Date;
}
```

### Client (Clientes)
```typescript
interface Client {
  id?: string;
  nombre: string;
  telefono: string;
  email?: string;
  fechaCreacion: Date;
  estado: 'nuevo' | 'contactado' | 'cita' | 'cerrado';
  notas?: string;
  ultimaInteraccion?: Date;
}
```

---

## Funcionalidades

### Sitio Publico
- **Home**: Hero, servicios destacados, seccion "Por que elegirnos"
- **Servicios**: Catalogo con filtrado por categoria
- **Reservaciones**: Formulario para agendar citas
- **Nosotros, Galeria, Contacto**: Paginas informativas

### Panel de Admin (/admin)
- **Dashboard**: Estadisticas y accesos rapidos
- **Servicios**: CRUD completo, subida de imagenes, marcar destacados
- **Reservaciones**: Confirmar/cancelar citas
- **Clientes**: Gestion de clientes

---

## Caracteristicas Tecnicas de Angular 19

### Standalone Components
```typescript
@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `...`
})
export class ServicesComponent { }
```

### Signals para Estado Reactivo
```typescript
services = signal<SpaService[]>([]);
selectedCategory = signal<string>('all');

filteredServices = computed(() => {
  if (this.selectedCategory() === 'all') return this.services();
  return this.services().filter(s => s.categoria === this.selectedCategory());
});
```

### Control Flow Syntax
```typescript
@if (services().length > 0) {
  @for (service of services(); track service.id) {
    <app-service-card [service]="service" />
  }
} @else {
  <p>No hay servicios</p>
}
```

### Inject Function
```typescript
private firebase = inject(FirebaseService);
private fb = inject(FormBuilder);
```

### Lazy Loading
```typescript
{ path: 'servicios', loadComponent: () =>
    import('./features/services/services.component')
    .then(m => m.ServicesComponent)
}
```

---

## Configuracion de Firebase

### Indices Requeridos
Crear indice compuesto en Firestore:
- **Collection**: `servicios`
- **Fields**: `activo` (Asc), `categoria` (Asc)

### CORS para Storage
```bash
# En Google Cloud Shell
echo '[{"origin": ["https://sunsetbeautyspa.com", "https://www.sunsetbeautyspa.com"], "method": ["GET", "HEAD"], "maxAgeSeconds": 3600}]' > cors.json
gsutil cors set cors.json gs://sunset-beauty-spa.firebasestorage.app
```

---

## Comandos

### Desarrollo
```bash
npm start           # Servidor de desarrollo (http://localhost:4200)
npm run build       # Build de produccion
```

### Deploy
```bash
vercel --prod --yes  # Deploy a Vercel
```

---

## Variables de Entorno

`src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: '...',
    authDomain: 'sunset-beauty-spa.firebaseapp.com',
    projectId: 'sunset-beauty-spa',
    storageBucket: 'sunset-beauty-spa.firebasestorage.app',
    messagingSenderId: '...',
    appId: '...'
  },
  whatsapp: {
    phoneNumber: '...',
    message: 'Hola, me gustaria obtener mas informacion sobre sus servicios.'
  }
};
```

---

## URLs

| Ambiente | URL |
|----------|-----|
| Produccion | https://sunsetbeautyspa.com |
| Admin | https://sunsetbeautyspa.com/admin |
| Vercel | https://sunsetbeautyspa.vercel.app |

---

## Mejoras Futuras

- [ ] Notificaciones por email/WhatsApp al crear reservacion
- [ ] Vista de calendario para citas
- [ ] Integracion de pagos online
- [ ] PWA (Progressive Web App)
- [ ] Google Analytics
- [ ] SEO y meta tags dinamicos

---

**Desarrollado con Angular 19 + Firebase + Vercel**

*Ultima actualizacion: Enero 2026*
