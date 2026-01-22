import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// ============================================
// CONFIGURACIÓN DEL SPA
// ============================================
const SPA_CONFIG = {
  nombre: "Sunset Beauty Spa",
  asistente: "Sofía",
  direccion: "Av. Ilaló y General Enríquez, Sangolquí, Ecuador",
  horarios: {
    "Lunes a Viernes": "9:00 AM – 7:00 PM",
    "Sábados": "9:00 AM – 5:00 PM",
    "Domingos": "Cerrado",
  },
  servicios: [
    { nombre: "Masaje relajante", duracion: "60 min", precio: 35, categoria: "Masajes" },
    { nombre: "Masaje descontracturante", duracion: "60 min", precio: 40, categoria: "Masajes" },
    { nombre: "Masaje con piedras calientes", duracion: "60 min", precio: 45, categoria: "Masajes" },
    { nombre: "Limpieza facial profunda", duracion: "45 min", precio: 30, categoria: "Faciales" },
    { nombre: "Facial hidratante", duracion: "45 min", precio: 35, categoria: "Faciales" },
    { nombre: "Tratamiento antiacné", duracion: "50 min", precio: 38, categoria: "Faciales" },
    { nombre: "Manicure tradicional", duracion: "30 min", precio: 15, categoria: "Estética" },
    { nombre: "Pedicure spa", duracion: "45 min", precio: 20, categoria: "Estética" },
    { nombre: "Depilación facial", duracion: "15 min", precio: 10, categoria: "Estética" },
  ],
};

const SYSTEM_PROMPT = `Eres Sofía, la asistente virtual de ${SPA_CONFIG.nombre}.

PERSONALIDAD:
- Eres amable, cercana y profesional
- Hablas de forma natural, como una persona real (no como un robot)
- Usas un tono cálido y acogedor
- Puedes usar emojis ocasionalmente pero sin exagerar
- Respondes de forma concisa, no escribes párrafos muy largos
- Si no sabes algo, dices que consultarás con el equipo

INFORMACIÓN DEL SPA:
- Nombre: ${SPA_CONFIG.nombre}
- Dirección: ${SPA_CONFIG.direccion}
- Horarios:
${Object.entries(SPA_CONFIG.horarios).map(([dia, hora]) => `  • ${dia}: ${hora}`).join("\n")}

SERVICIOS Y PRECIOS:
${SPA_CONFIG.servicios.map((s) => `- ${s.nombre} (${s.duracion}) - $${s.precio}`).join("\n")}

TU OBJETIVO:
1. Saludar amablemente y presentarte
2. Ayudar a los clientes a conocer los servicios
3. Coordinar citas (preguntar: qué servicio, qué día y hora prefieren)
4. Cuando el cliente quiera agendar, confirma los datos: nombre, servicio, fecha y hora
5. Si preguntan algo que no sabes, ofrece que alguien del equipo se comunicará

IMPORTANTE:
- No inventes información que no tengas
- Si te preguntan por servicios que no están en la lista, di que consultarás disponibilidad
- Siempre intenta guiar hacia agendar una cita
- Responde SOLO el mensaje, sin agregar "Sofía:" al inicio`;

// ============================================
// TIPOS
// ============================================
interface ConversationMessage {
  rol: "user" | "bot" | "admin";
  contenido: string;
  timestamp: admin.firestore.Timestamp;
}

interface GeminiContent {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

// ============================================
// UTILIDADES
// ============================================
const getQueryString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return "";
};

// Detectar si el usuario quiere hablar con un humano
const wantsHuman = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  const humanPhrases = [
    "hablar con una persona",
    "hablar con alguien",
    "hablar con humano",
    "quiero hablar con",
    "necesito hablar con",
    "persona real",
    "agente real",
    "operador",
    "humano",
    "representante",
    "asesor",
    "asesora",
    "prefiero hablar",
    "me comunican con",
    "pasar con alguien",
  ];
  return humanPhrases.some((phrase) => lowerText.includes(phrase));
};

// Enviar mensaje por WhatsApp
const sendWhatsAppMessage = async (to: string, message: string): Promise<boolean> => {
  const whatsappToken = process.env.WHATSAPP_TOKEN || "";
  const phoneId = process.env.WHATSAPP_PHONE_ID || "";

  if (!whatsappToken || !phoneId) {
    console.log("WhatsApp credentials missing");
    return false;
  }

  try {
    const axios = await import("axios");
    await axios.default.post(
      `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${whatsappToken}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );
    console.log("WhatsApp message sent to:", to);
    return true;
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return false;
  }
};

// ============================================
// WEBHOOK PRINCIPAL - Recibe mensajes de WhatsApp
// ============================================
export const whatsappWebhook = onRequest(
  { region: "southamerica-east1", timeoutSeconds: 60 },
  async (req, res) => {
    if (admin.apps.length === 0) {
      admin.initializeApp();
    }

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "";

    // Webhook verification (GET)
    if (req.method === "GET") {
      const mode = getQueryString(req.query["hub.mode"]);
      const token = getQueryString(req.query["hub.verify_token"]);
      const challenge = getQueryString(req.query["hub.challenge"]);

      if (mode === "subscribe" && token === verifyToken) {
        console.log("Webhook verified");
        res.status(200).send(challenge);
        return;
      }
      res.status(403).send();
      return;
    }

    // Incoming messages (POST)
    if (req.method === "POST") {
      res.status(200).send();

      try {
        const body = req.body;
        const entry = body?.entry?.[0];
        const change = entry?.changes?.[0];
        const value = change?.value;

        if (value?.statuses) return;

        const message = value?.messages?.[0];
        if (!message || message.type !== "text" || !message.text?.body) return;

        const from: string = message.from || "";
        const text: string = message.text.body;

        console.log("Message received from:", from, "Text:", text);

        const db = admin.firestore();

        // 1. Obtener o crear cliente
        const clientsRef = db.collection("clientes");
        const clientQuery = await clientsRef.where("telefono", "==", from).limit(1).get();

        let clientId: string;
        if (clientQuery.empty) {
          const newClientRef = await clientsRef.add({
            nombre: "",
            telefono: from,
            email: "",
            fechaCreacion: admin.firestore.Timestamp.now(),
            estado: "nuevo",
            notas: "",
            ultimaInteraccion: admin.firestore.Timestamp.now(),
          });
          clientId = newClientRef.id;
        } else {
          clientId = clientQuery.docs[0].id;
          await clientQuery.docs[0].ref.update({
            ultimaInteraccion: admin.firestore.Timestamp.now(),
          });
        }

        // 2. Obtener o crear conversación
        const convsRef = db.collection("conversaciones");
        const convQuery = await convsRef.where("telefono", "==", from).limit(1).get();

        let conversationId: string;
        let conversationState = "activa";
        let history: GeminiContent[] = [];

        if (convQuery.empty) {
          const newConvRef = await convsRef.add({
            clienteId: clientId,
            clienteNombre: "",
            telefono: from,
            mensajes: [],
            fechaInicio: admin.firestore.Timestamp.now(),
            fechaUltimoMensaje: admin.firestore.Timestamp.now(),
            estado: "activa",
          });
          conversationId = newConvRef.id;
        } else {
          const convDoc = convQuery.docs[0];
          conversationId = convDoc.id;
          const convData = convDoc.data();
          conversationState = convData.estado || "activa";
          const mensajes = convData.mensajes || [];
          history = mensajes.map((m: ConversationMessage) => ({
            role: m.rol === "user" ? "user" : "model",
            parts: [{ text: m.contenido }],
          }));
        }

        // 3. Guardar mensaje del usuario
        const userMessage: ConversationMessage = {
          rol: "user",
          contenido: text,
          timestamp: admin.firestore.Timestamp.now(),
        };
        await db.collection("conversaciones").doc(conversationId).update({
          mensajes: admin.firestore.FieldValue.arrayUnion(userMessage),
          fechaUltimoMensaje: admin.firestore.Timestamp.now(),
        });

        // 4. Si la conversación está DERIVADA, no responder automáticamente
        if (conversationState === "derivada") {
          console.log("Conversation is derived, not responding automatically");
          return;
        }

        // 5. Detectar si quiere hablar con humano
        if (wantsHuman(text)) {
          console.log("User wants to talk to a human, deriving conversation");

          // Cambiar estado a derivada
          await db.collection("conversaciones").doc(conversationId).update({
            estado: "derivada",
          });

          // Mensaje de derivación
          const derivationMessage = "Entiendo que prefieres hablar con una persona. En breve alguien de nuestro equipo se comunicará contigo. ¡Gracias por tu paciencia! 😊";

          // Guardar respuesta
          const botMessage: ConversationMessage = {
            rol: "bot",
            contenido: derivationMessage,
            timestamp: admin.firestore.Timestamp.now(),
          };
          await db.collection("conversaciones").doc(conversationId).update({
            mensajes: admin.firestore.FieldValue.arrayUnion(botMessage),
          });

          // Enviar por WhatsApp
          await sendWhatsAppMessage(from, derivationMessage);
          return;
        }

        // 6. Generar respuesta con Gemini
        const geminiApiKey = process.env.GEMINI_API_KEY || "";
        let botResponse = "Hola, gracias por escribirnos. En este momento no puedo responder, pero alguien del equipo te contactará pronto.";

        if (geminiApiKey) {
          try {
            const axios = await import("axios");
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

            const contents: GeminiContent[] = [
              ...history,
              { role: "user", parts: [{ text }] },
            ];

            const geminiResponse = await axios.default.post(
              geminiUrl,
              {
                contents,
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
              },
              { headers: { "Content-Type": "application/json" }, timeout: 25000 }
            );

            const generatedText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (generatedText) {
              botResponse = generatedText;
            }
          } catch (geminiError) {
            console.error("Gemini error:", geminiError);
          }
        }

        // 7. Guardar respuesta del bot
        const botMessage: ConversationMessage = {
          rol: "bot",
          contenido: botResponse,
          timestamp: admin.firestore.Timestamp.now(),
        };
        await db.collection("conversaciones").doc(conversationId).update({
          mensajes: admin.firestore.FieldValue.arrayUnion(botMessage),
          fechaUltimoMensaje: admin.firestore.Timestamp.now(),
        });

        // 8. Enviar respuesta por WhatsApp
        await sendWhatsAppMessage(from, botResponse);

        console.log("Message processed successfully");
      } catch (error) {
        console.error("Error processing message:", error);
      }
      return;
    }

    res.status(405).send();
  }
);

// ============================================
// FUNCIÓN PARA QUE EL ADMIN RESPONDA
// ============================================
export const sendAdminMessage = onRequest(
  { region: "southamerica-east1", cors: true },
  async (req, res) => {
    if (admin.apps.length === 0) {
      admin.initializeApp();
    }

    // Solo permitir POST
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    try {
      const { conversationId, message } = req.body;

      if (!conversationId || !message) {
        res.status(400).json({ error: "conversationId and message are required" });
        return;
      }

      const db = admin.firestore();

      // Obtener la conversación
      const convDoc = await db.collection("conversaciones").doc(conversationId).get();
      if (!convDoc.exists) {
        res.status(404).json({ error: "Conversation not found" });
        return;
      }

      const convData = convDoc.data();
      const telefono = convData?.telefono;

      if (!telefono) {
        res.status(400).json({ error: "No phone number in conversation" });
        return;
      }

      // Guardar mensaje del admin
      const adminMessage: ConversationMessage = {
        rol: "admin",
        contenido: message,
        timestamp: admin.firestore.Timestamp.now(),
      };
      await db.collection("conversaciones").doc(conversationId).update({
        mensajes: admin.firestore.FieldValue.arrayUnion(adminMessage),
        fechaUltimoMensaje: admin.firestore.Timestamp.now(),
      });

      // Enviar por WhatsApp
      const sent = await sendWhatsAppMessage(telefono, message);

      if (sent) {
        res.status(200).json({ success: true, message: "Message sent" });
      } else {
        res.status(500).json({ error: "Failed to send WhatsApp message" });
      }
    } catch (error) {
      console.error("Error sending admin message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ============================================
// FUNCIÓN PARA REACTIVAR CONVERSACIÓN (volver a bot)
// ============================================
export const reactivateConversation = onRequest(
  { region: "southamerica-east1", cors: true },
  async (req, res) => {
    if (admin.apps.length === 0) {
      admin.initializeApp();
    }

    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    try {
      const { conversationId } = req.body;

      if (!conversationId) {
        res.status(400).json({ error: "conversationId is required" });
        return;
      }

      const db = admin.firestore();
      await db.collection("conversaciones").doc(conversationId).update({
        estado: "activa",
      });

      res.status(200).json({ success: true, message: "Conversation reactivated" });
    } catch (error) {
      console.error("Error reactivating conversation:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
