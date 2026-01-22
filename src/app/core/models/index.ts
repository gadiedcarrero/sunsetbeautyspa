// Client model
export interface Client {
  id?: string;
  nombre: string;
  telefono: string;
  email?: string;
  fechaCreacion: Date;
  estado: 'nuevo' | 'contactado' | 'cita' | 'cerrado';
  notas?: string;
  ultimaInteraccion?: Date;
}

// Conversation model
export interface Message {
  rol: 'user' | 'bot' | 'admin';
  contenido: string;
  timestamp: Date;
}

export interface Conversation {
  id?: string;
  clienteId: string;
  telefono: string;
  mensajes: Message[];
  resumen?: string;
  fechaInicio: Date;
  fechaUltimoMensaje: Date;
  estado: 'activa' | 'cerrada' | 'derivada';
}

// Reservation model
export interface Reservation {
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

// Service model
export interface SpaService {
  id?: string;
  nombre: string;
  descripcion: string;
  precio?: number;
  duracion: string;
  categoria: 'facial' | 'corporal' | 'masajes' | 'unas' | 'depilacion' | 'otros';
  imagen?: string;
  activo: boolean;
}

// Contact form
export interface ContactForm {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
  fechaEnvio: Date;
}

// Business info
export interface BusinessInfo {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  horarios: {
    [key: string]: string;
  };
  redesSociales: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}
