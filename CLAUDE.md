# Sunset Beauty Spa

## Descripcion del Proyecto
Sitio web para un spa de belleza con sistema de reservaciones, panel de administracion y gestion de servicios.

## URLs
- **Produccion:** https://sunsetbeautyspa.com
- **Vercel:** https://sunsetbeautyspa.vercel.app
- **Admin:** https://sunsetbeautyspa.com/admin

## Stack Tecnologico
- **Frontend:** Angular 19 (standalone components)
- **Backend:** Firebase (Firestore, Auth, Storage)
- **Hosting:** Vercel
- **Estilos:** SCSS con variables y mixins

## Estructura del Proyecto
```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Interfaces (SpaService, Reservation, Client, etc.)
│   │   ├── services/        # Servicios de Firebase
│   │   └── guards/          # Auth guard
│   ├── features/
│   │   ├── home/            # Pagina principal
│   │   ├── services/        # Pagina de servicios publicos
│   │   ├── reservations/    # Formulario de reservaciones
│   │   ├── about/           # Nosotros
│   │   ├── contact/         # Contacto
│   │   ├── gallery/         # Galeria
│   │   └── admin/           # Panel de administracion
│   │       ├── dashboard/
│   │       ├── services/    # CRUD de servicios
│   │       ├── reservations/
│   │       ├── clients/
│   │       └── conversations/
│   ├── layout/
│   │   ├── header/          # Navbar con logo
│   │   └── footer/
│   └── shared/
│       └── components/
│           ├── service-card/
│           └── image-upload/
├── environments/
│   ├── environment.ts       # Desarrollo
│   └── environment.prod.ts  # Produccion (Firebase config)
└── styles/
    ├── _variables.scss
    └── _mixins.scss
```

## Firebase Collections
- **servicios** - Servicios del spa (nombre, descripcion, precio, duracion, categoria, imagen, activo, destacado)
- **reservaciones** - Citas de clientes
- **clientes** - Informacion de clientes
- **conversaciones** - Historial de conversaciones

## Funcionalidades Principales

### Servicios
- CRUD completo desde el admin
- Campo `activo` para mostrar/ocultar servicios
- Campo `destacado` para mostrar en la portada (max 3)
- Subida de imagenes a Firebase Storage
- Filtrado por categoria en la pagina publica

### Reservaciones
- Formulario publico en /reservaciones
- Estados: pendiente, confirmada, cancelada
- Gestion desde el panel de admin

### Admin
- Autenticacion con Firebase Auth
- Dashboard con estadisticas
- Gestion de servicios, reservaciones, clientes y conversaciones

## Indices de Firebase Requeridos
La coleccion `servicios` requiere un indice compuesto:
- Collection: `servicios`
- Fields: `activo` (Ascending), `categoria` (Ascending)

## Configuracion CORS (Firebase Storage)
Archivo `cors.json` aplicado con:
```json
[
  {
    "origin": ["https://sunsetbeautyspa.com", "https://www.sunsetbeautyspa.com", "http://localhost:4200"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```
Comando: `gsutil cors set cors.json gs://sunset-beauty-spa.firebasestorage.app`

## Comandos Utiles
```bash
# Desarrollo
npm start

# Build
npm run build

# Deploy a Vercel
vercel --prod --yes
```

## Variables de Entorno
La configuracion de Firebase esta en `src/environments/environment.prod.ts`:
- apiKey
- authDomain
- projectId
- storageBucket
- messagingSenderId
- appId

## Notas Importantes
- El logo esta en `/public/Sunset_logo.png` (200px en header, 80px al hacer scroll)
- Las imagenes de servicios se suben a Firebase Storage en la carpeta `services/`
- No hay datos hardcodeados - todo viene de Firebase
- El dominio personalizado esta configurado en Vercel
