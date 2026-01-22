# Sunset Beauty Spa

Aplicación web para gestión de spa con chatbot de WhatsApp integrado con IA.

## Tecnologías

- **Frontend**: Angular 19 (Standalone Components + Signals)
- **Backend**: Firebase (Firestore, Auth, Cloud Functions, Hosting)
- **WhatsApp**: Cloud Functions webhook + Meta Business API
- **IA**: Google Gemini (pendiente de integrar)
- **Region**: `southamerica-east1` (São Paulo)

## Estructura del Proyecto

```
sunsetbeautyspa/
├── src/                           # Código fuente Angular
│   ├── app/
│   │   ├── core/                  # Servicios, modelos, guards
│   │   │   ├── models/            # Interfaces TypeScript
│   │   │   ├── services/          # Servicios Firestore
│   │   │   └── guards/            # Auth guards
│   │   ├── features/              # Componentes por funcionalidad
│   │   │   ├── home/              # Página de inicio
│   │   │   ├── about/             # Nosotros
│   │   │   ├── services/          # Catálogo de servicios
│   │   │   ├── gallery/           # Galería
│   │   │   ├── reservations/      # Sistema de reservaciones
│   │   │   ├── contact/           # Contacto
│   │   │   └── admin/             # Panel administrativo
│   │   │       ├── login/
│   │   │       ├── dashboard/
│   │   │       ├── clients/
│   │   │       ├── conversations/
│   │   │       ├── reservations/
│   │   │       └── services/
│   │   ├── layout/                # Header y Footer
│   │   └── shared/                # Componentes reutilizables
│   ├── assets/                    # Imágenes y recursos
│   ├── environments/              # Configuración por entorno
│   └── styles/                    # Estilos SCSS globales
├── functions/                     # Firebase Cloud Functions
│   ├── src/index.ts               # Webhook WhatsApp
│   └── .env                       # Variables de entorno
├── firebase.json                  # Configuración Firebase
└── package.json                   # Dependencias
```

## Modelos de Datos (Firestore)

### Clientes (`clientes`)
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

### Conversaciones (`conversaciones`)
```typescript
interface Message {
  rol: 'user' | 'bot' | 'admin';
  contenido: string;
  timestamp: Date;
}

interface Conversation {
  id?: string;
  clienteId: string;
  telefono: string;
  mensajes: Message[];
  resumen?: string;
  fechaInicio: Date;
  fechaUltimoMensaje: Date;
  estado: 'activa' | 'cerrada' | 'derivada';
}
```

### Reservaciones (`reservaciones`)
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

### Servicios (`servicios`)
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
}
```

## Firebase Cloud Functions

### whatsappWebhook
Webhook para recibir y responder mensajes de WhatsApp.

**URL**: `https://southamerica-east1-sunset-beauty-spa.cloudfunctions.net/whatsappWebhook`

**Variables de entorno** (`functions/.env`):
```
WHATSAPP_TOKEN=<token de acceso de Meta>
WHATSAPP_VERIFY_TOKEN=sunset_spa_webhook_2026
WHATSAPP_PHONE_ID=<ID del número de teléfono>
GEMINI_API_KEY=<pendiente - API key de Google Gemini>
```

## Comandos

### Desarrollo
```bash
# Iniciar servidor de desarrollo
ng serve

# Abrir en http://localhost:4200
```

### Build y Deploy
```bash
# Build del proyecto Angular
ng build

# Build de Cloud Functions
npm --prefix functions run build

# Deploy de Cloud Functions
firebase deploy --only functions

# Deploy completo (hosting + functions)
firebase deploy
```

### Logs
```bash
# Ver logs de Cloud Functions
firebase functions:log
```

## Configuración Inicial

### 1. Firebase
- Proyecto: `sunset-beauty-spa`
- Plan: Blaze (pay as you go)
- APIs habilitadas:
  - Cloud Functions
  - Cloud Build
  - Artifact Registry
  - Pub/Sub
  - Eventarc
  - Cloud Storage

### 2. App Engine
- Region: `southamerica-east1`
- Requerido para Cloud Functions v2

### 3. Meta WhatsApp Business API
- Webhook URL: `https://southamerica-east1-sunset-beauty-spa.cloudfunctions.net/whatsappWebhook`
- Verify Token: `sunset_spa_webhook_2026`
- Suscripciones activas: `messages`

## Estado Actual del Proyecto

### Completado
- [x] Estructura Angular con componentes standalone
- [x] Panel administrativo con autenticación
- [x] Modelos de datos y servicios Firestore
- [x] Gestión de clientes, conversaciones, reservaciones y servicios
- [x] Cloud Function para webhook de WhatsApp
- [x] Configuración de Firebase (Blaze plan, App Engine, APIs)
- [x] Conexión con Meta WhatsApp Business API
- [x] Webhook verificado y funcionando

### Pendiente
- [ ] Integrar Google Gemini para respuestas con IA
- [ ] Hacer que el chatbot responda automáticamente
- [ ] Configurar personalidad del bot (nombre, tono, información del spa)
- [ ] Guardar conversaciones en Firestore
- [ ] Crear/actualizar clientes automáticamente
- [ ] Coordinar citas desde el chat
- [ ] Configurar información del spa (servicios, precios, horarios)

## Próximos Pasos (Chatbot IA)

1. **Obtener API Key de Gemini**: https://aistudio.google.com/apikey
2. **Agregar a variables de entorno**: `GEMINI_API_KEY`
3. **Actualizar Cloud Function** para:
   - Recibir mensaje de WhatsApp
   - Consultar/crear cliente en Firestore
   - Enviar mensaje a Gemini con contexto del spa
   - Responder al usuario por WhatsApp
   - Guardar conversación en Firestore

## Información del Spa (Por Configurar)

```typescript
const spaConfig = {
  nombre: '', // Nombre del spa
  asistente: '', // Nombre del bot (ej: "Ana", "María")
  direccion: '',
  telefono: '',
  horarios: {
    lunes: '',
    martes: '',
    // ...
  },
  servicios: [
    // Lista de servicios con precios y duración
  ]
};
```

## Contacto

Proyecto desarrollado para cliente de spa en Ecuador.
