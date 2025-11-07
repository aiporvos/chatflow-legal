#!/usr/bin/env node

/**
 * Script para generar datos de prueba para todas las pantallas
 * Crea usuarios con roles específicos y datos relacionados (casos, contactos, etc.)
 */

import { createClient } from '@supabase/supabase-js';

const PROJECT_URL = 'https://bkpgkenxyretsrxxrxfb.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcGdrZW54eXJldHNyeHhyeGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI4NDI1MCwiZXhwIjoyMDc3ODYwMjUwfQ.baaSgzhLryrAJLULhkTnzx7J0Q9W8Zov187BUP1CowA';

const supabase = createClient(PROJECT_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const testUsers = [
  {
    email: 'admin@legal.ai',
    password: 'Test123456',
    fullName: 'Administrador Legal IA',
    phone: '+54 11 1200-0000',
    roles: ['admin', 'lawyer'],
  },
  {
    email: 'abogado1@legal.ai',
    password: 'Test123456',
    fullName: 'Dr. Carlos Mendoza',
    phone: '+54 11 1234-5678',
    roles: ['lawyer'],
  },
  {
    email: 'abogado2@legal.ai',
    password: 'Test123456',
    fullName: 'Dra. María González',
    phone: '+54 11 2345-6789',
    roles: ['lawyer'],
  },
  {
    email: 'abogado3@legal.ai',
    password: 'Test123456',
    fullName: 'Dr. Ignacio Romero',
    phone: '+54 11 3456-7000',
    roles: ['lawyer'],
  },
  {
    email: 'coordinador@legal.ai',
    password: 'Test123456',
    fullName: 'Coordinadora General',
    phone: '+54 11 4560-8000',
    roles: ['admin', 'lawyer'],
  },
  {
    email: 'cliente1@legal.ai',
    password: 'Test123456',
    fullName: 'Juan Pérez',
    phone: '+54 11 3456-7890',
    roles: ['client'],
  },
  {
    email: 'cliente2@legal.ai',
    password: 'Test123456',
    fullName: 'Ana Martínez',
    phone: '+54 11 4567-8901',
    roles: ['client'],
  },
  {
    email: 'cliente3@legal.ai',
    password: 'Test123456',
    fullName: 'Roberto Sánchez',
    phone: '+54 11 5678-9012',
    roles: ['client'],
  },
  {
    email: 'cliente4@legal.ai',
    password: 'Test123456',
    fullName: 'Lucía Fernández',
    phone: '+54 11 6789-0123',
    roles: ['client'],
  },
  {
    email: 'cliente5@legal.ai',
    password: 'Test123456',
    fullName: 'Martín Domínguez',
    phone: '+54 11 7890-1234',
    roles: ['client'],
  },
  {
    email: 'cliente6@legal.ai',
    password: 'Test123456',
    fullName: 'Camila Bustos',
    phone: '+54 11 8901-2345',
    roles: ['client'],
  },
  {
    email: 'cliente7@legal.ai',
    password: 'Test123456',
    fullName: 'Hernán López',
    phone: '+54 11 9012-3456',
    roles: ['client'],
  },
  {
    email: 'cliente8@legal.ai',
    password: 'Test123456',
    fullName: 'Patricia Núñez',
    phone: '+54 11 9123-4567',
    roles: ['client'],
  },
];

const casesData = [
  {
    case_number: 'EXP-2024-001',
    title: 'Divorcio Contencioso - Pérez vs Pérez',
    description:
      'Proceso de divorcio contencioso con disputa sobre bienes gananciales y custodia de menores.',
    status: 'in_progress',
    clientEmail: 'cliente1@legal.ai',
    lawyerEmail: 'abogado1@legal.ai',
  },
  {
    case_number: 'EXP-2024-002',
    title: 'Accidente de Tránsito - Martínez',
    description: 'Reclamo por daños y perjuicios derivados de accidente de tránsito. Lesiones leves.',
    status: 'new',
    clientEmail: 'cliente2@legal.ai',
    lawyerEmail: 'abogado2@legal.ai',
  },
  {
    case_number: 'EXP-2024-003',
    title: 'Contrato Laboral - Sánchez',
    description: 'Despido injustificado. Reclamo por indemnización y vacaciones no gozadas.',
    status: 'in_progress',
    clientEmail: 'cliente3@legal.ai',
    lawyerEmail: 'abogado1@legal.ai',
  },
  {
    case_number: 'EXP-2024-004',
    title: 'Sucesión - Familia Rodríguez',
    description: 'Proceso sucesorio con testamento. Distribución de bienes entre herederos.',
    status: 'closed',
    clientEmail: 'cliente1@legal.ai',
    lawyerEmail: 'abogado2@legal.ai',
  },
  {
    case_number: 'EXP-2024-005',
    title: 'Contrato Comercial - Empresa ABC',
    description: 'Incumplimiento contractual. Reclamo por daños y perjuicios.',
    status: 'pending_review',
    clientEmail: 'cliente2@legal.ai',
    lawyerEmail: 'abogado1@legal.ai',
  },
  {
    case_number: 'EXP-2024-006',
    title: 'Reclamo de ARS - Fernández',
    description: 'Recupero de gastos médicos no cubiertos por la aseguradora.',
    status: 'pending_review',
    clientEmail: 'cliente4@legal.ai',
    lawyerEmail: 'abogado3@legal.ai',
  },
  {
    case_number: 'EXP-2024-007',
    title: 'Litigio Propiedad Intelectual - Domínguez',
    description: 'Demanda por uso indebido de marca registrada en piezas publicitarias.',
    status: 'in_progress',
    clientEmail: 'cliente5@legal.ai',
    lawyerEmail: 'coordinador@legal.ai',
  },
  {
    case_number: 'EXP-2024-008',
    title: 'Amparo de Salud - Bustos',
    description: 'Acción de amparo para obtener medicación de alto costo.',
    status: 'new',
    clientEmail: 'cliente6@legal.ai',
    lawyerEmail: 'abogado3@legal.ai',
  },
  {
    case_number: 'EXP-2024-009',
    title: 'Revisión de Contrato - López',
    description: 'Análisis de cláusulas abusivas en contrato de alquiler comercial.',
    status: 'pending_review',
    clientEmail: 'cliente7@legal.ai',
    lawyerEmail: 'abogado2@legal.ai',
  },
  {
    case_number: 'EXP-2024-010',
    title: 'Cobro Ejecutivo - Núñez',
    description: 'Inicio de acción ejecutiva por pagaré impago.',
    status: 'in_progress',
    clientEmail: 'cliente8@legal.ai',
    lawyerEmail: 'coordinador@legal.ai',
  },
  {
    case_number: 'EXP-2024-011',
    title: 'Arbitraje Comercial - Exportaciones Río',
    description: 'Controversia de arbitraje por incumplimiento de contrato internacional.',
    status: 'closed',
    clientEmail: 'cliente5@legal.ai',
    lawyerEmail: 'abogado1@legal.ai',
  },
  {
    case_number: 'EXP-2024-012',
    title: 'Defensa Penal Económica - Bustos',
    description: 'Asesoramiento y defensa en investigación por evasión impositiva.',
    status: 'archived',
    clientEmail: 'cliente6@legal.ai',
    lawyerEmail: 'abogado3@legal.ai',
  },
];

const contactsData = [
  {
    name: 'Dr. Luis Fernández',
    email: 'luis.fernandez@legal.ai',
    phone: '+54 11 6789-0123',
    createdByEmail: 'abogado1@legal.ai',
  },
  {
    name: 'Dra. Patricia López',
    email: 'patricia.lopez@legal.ai',
    phone: '+54 11 7890-1234',
    createdByEmail: 'abogado2@legal.ai',
  },
  {
    name: 'Testigo - María García',
    email: 'maria.garcia@email.com',
    phone: '+54 11 8901-2345',
    createdByEmail: 'abogado1@legal.ai',
  },
  {
    name: 'Perito - Dr. Jorge Ramírez',
    email: 'jorge.ramirez@peritos.com',
    phone: '+54 11 9012-3456',
    createdByEmail: 'abogado2@legal.ai',
  },
  {
    name: 'Cliente Potencial - Sofía Torres',
    email: 'sofia.torres@email.com',
    phone: '+54 11 0123-4567',
    createdByEmail: 'abogado1@legal.ai',
  },
  {
    name: 'Perito Contable - Marcelo Ruiz',
    email: 'marcelo.ruiz@peritos.com',
    phone: '+54 11 2233-4455',
    createdByEmail: 'coordinador@legal.ai',
  },
  {
    name: 'Testigo - Esteban Gómez',
    email: 'esteban.gomez@email.com',
    phone: '+54 11 3344-5566',
    createdByEmail: 'abogado3@legal.ai',
  },
  {
    name: 'Consultor IT - Laura Benítez',
    email: 'laura.benitez@consultores.com',
    phone: '+54 11 4455-6677',
    createdByEmail: 'abogado1@legal.ai',
  },
  {
    name: 'Perito Médico - Dr. Ricardo Álvarez',
    email: 'ricardo.alvarez@peritos.com',
    phone: '+54 11 5566-7788',
    createdByEmail: 'abogado2@legal.ai',
  },
  {
    name: 'Testigo - Gabriela Castro',
    email: 'gabriela.castro@email.com',
    phone: '+54 11 6677-8899',
    createdByEmail: 'abogado3@legal.ai',
  },
  {
    name: 'Proveedor - Servicios Forenses Argentinos',
    email: 'contacto@forenses.com',
    phone: '+54 11 7788-9900',
    createdByEmail: 'coordinador@legal.ai',
  },
];

const documentsData = [
  {
    file_name: 'Demanda_Inicial_EXP-001.pdf',
    file_url: 'https://example.com/docs/demanda-001.pdf',
    file_type: 'application/pdf',
    file_size: 245760,
    case_number: 'EXP-2024-001',
    uploadedByEmail: 'abogado1@legal.ai',
  },
  {
    file_name: 'Contrato_Laboral_EXP-003.pdf',
    file_url: 'https://example.com/docs/contrato-003.pdf',
    file_type: 'application/pdf',
    file_size: 189440,
    case_number: 'EXP-2024-003',
    uploadedByEmail: 'abogado1@legal.ai',
  },
  {
    file_name: 'Testamento_EXP-004.pdf',
    file_url: 'https://example.com/docs/testamento-004.pdf',
    file_type: 'application/pdf',
    file_size: 153600,
    case_number: 'EXP-2024-004',
    uploadedByEmail: 'abogado2@legal.ai',
  },
  {
    file_name: 'Pericia_Medica_EXP-002.pdf',
    file_url: 'https://example.com/docs/pericia-002.pdf',
    file_type: 'application/pdf',
    file_size: 307200,
    case_number: 'EXP-2024-002',
    uploadedByEmail: 'abogado2@legal.ai',
  },
  {
    file_name: 'Sentencia_EXP-004.pdf',
    file_url: 'https://example.com/docs/sentencia-004.pdf',
    file_type: 'application/pdf',
    file_size: 204800,
    case_number: 'EXP-2024-004',
    uploadedByEmail: 'abogado2@legal.ai',
  },
  {
    file_name: 'Informe_Pericial_EXP-006.pdf',
    file_url: 'https://example.com/docs/pericial-006.pdf',
    file_type: 'application/pdf',
    file_size: 275200,
    case_number: 'EXP-2024-006',
    uploadedByEmail: 'abogado3@legal.ai',
  },
  {
    file_name: 'Requerimiento_Aseguradora_EXP-006.docx',
    file_url: 'https://example.com/docs/requerimiento-006.docx',
    file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    file_size: 128000,
    case_number: 'EXP-2024-006',
    uploadedByEmail: 'coordinador@legal.ai',
  },
  {
    file_name: 'Medida_Cautelar_EXP-007.pdf',
    file_url: 'https://example.com/docs/cautelar-007.pdf',
    file_type: 'application/pdf',
    file_size: 198500,
    case_number: 'EXP-2024-007',
    uploadedByEmail: 'coordinador@legal.ai',
  },
  {
    file_name: 'Pericia_Marca_EXP-007.pdf',
    file_url: 'https://example.com/docs/pericia-marca-007.pdf',
    file_type: 'application/pdf',
    file_size: 233100,
    case_number: 'EXP-2024-007',
    uploadedByEmail: 'abogado1@legal.ai',
  },
  {
    file_name: 'Amparo_Salud_EXP-008.pdf',
    file_url: 'https://example.com/docs/amparo-008.pdf',
    file_type: 'application/pdf',
    file_size: 196400,
    case_number: 'EXP-2024-008',
    uploadedByEmail: 'abogado3@legal.ai',
  },
  {
    file_name: 'Historia_Clinica_EXP-008.pdf',
    file_url: 'https://example.com/docs/historia-008.pdf',
    file_type: 'application/pdf',
    file_size: 320000,
    case_number: 'EXP-2024-008',
    uploadedByEmail: 'abogado3@legal.ai',
  },
  {
    file_name: 'Informe_Contrato_EXP-009.pdf',
    file_url: 'https://example.com/docs/contrato-009.pdf',
    file_type: 'application/pdf',
    file_size: 158700,
    case_number: 'EXP-2024-009',
    uploadedByEmail: 'abogado2@legal.ai',
  },
  {
    file_name: 'Carta_Documento_EXP-009.docx',
    file_url: 'https://example.com/docs/carta-009.docx',
    file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    file_size: 102400,
    case_number: 'EXP-2024-009',
    uploadedByEmail: 'abogado2@legal.ai',
  },
  {
    file_name: 'Demanda_Ejecutiva_EXP-010.pdf',
    file_url: 'https://example.com/docs/ejecutiva-010.pdf',
    file_type: 'application/pdf',
    file_size: 214500,
    case_number: 'EXP-2024-010',
    uploadedByEmail: 'coordinador@legal.ai',
  },
  {
    file_name: 'Pagaré_Digital_EXP-010.pdf',
    file_url: 'https://example.com/docs/pagare-010.pdf',
    file_type: 'application/pdf',
    file_size: 98000,
    case_number: 'EXP-2024-010',
    uploadedByEmail: 'coordinador@legal.ai',
  },
  {
    file_name: 'Dictamen_Arbitral_EXP-011.pdf',
    file_url: 'https://example.com/docs/arbitral-011.pdf',
    file_type: 'application/pdf',
    file_size: 276800,
    case_number: 'EXP-2024-011',
    uploadedByEmail: 'abogado1@legal.ai',
  },
  {
    file_name: 'Acuerdo_Arbitral_EXP-011.pdf',
    file_url: 'https://example.com/docs/acuerdo-011.pdf',
    file_type: 'application/pdf',
    file_size: 182000,
    case_number: 'EXP-2024-011',
    uploadedByEmail: 'abogado1@legal.ai',
  },
  {
    file_name: 'Informe_Fiscal_EXP-012.pdf',
    file_url: 'https://example.com/docs/fiscal-012.pdf',
    file_type: 'application/pdf',
    file_size: 244000,
    case_number: 'EXP-2024-012',
    uploadedByEmail: 'abogado3@legal.ai',
  },
  {
    file_name: 'Plan_Defensa_EXP-012.docx',
    file_url: 'https://example.com/docs/defensa-012.docx',
    file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    file_size: 134000,
    case_number: 'EXP-2024-012',
    uploadedByEmail: 'abogado3@legal.ai',
  },
];

const calendarEventsData = [
  {
    title: 'Audiencia Preliminar - EXP-2024-001',
    description: 'Primera audiencia para el caso de divorcio. Presentación de pruebas.',
    startOffsetDays: 7,
    durationHours: 2,
    case_number: 'EXP-2024-001',
    createdByEmail: 'abogado1@legal.ai',
    attendees: ['abogado1@legal.ai', 'cliente1@legal.ai'],
  },
  {
    title: 'Reunión con Cliente - EXP-2024-002',
    description: 'Revisión de documentación del accidente y estrategia legal.',
    startOffsetDays: 3,
    durationHours: 1,
    case_number: 'EXP-2024-002',
    createdByEmail: 'abogado2@legal.ai',
    attendees: ['abogado2@legal.ai', 'cliente2@legal.ai'],
  },
  {
    title: 'Mediación - EXP-2024-003',
    description: 'Sesión de mediación para intentar acuerdo extrajudicial.',
    startOffsetDays: 10,
    durationHours: 3,
    case_number: 'EXP-2024-003',
    createdByEmail: 'abogado1@legal.ai',
    attendees: ['abogado1@legal.ai', 'cliente3@legal.ai'],
  },
  {
    title: 'Control Médico - EXP-2024-006',
    description: 'Entrega de resultados periciales y definición de estrategia.',
    startOffsetDays: 5,
    durationHours: 1,
    case_number: 'EXP-2024-006',
    createdByEmail: 'abogado3@legal.ai',
    attendees: ['abogado3@legal.ai', 'cliente4@legal.ai'],
  },
  {
    title: 'Reunión Creativa - EXP-2024-007',
    description: 'Preparación de pruebas para el litigio de propiedad intelectual.',
    startOffsetDays: 4,
    durationHours: 2,
    case_number: 'EXP-2024-007',
    createdByEmail: 'coordinador@legal.ai',
    attendees: ['coordinador@legal.ai', 'cliente5@legal.ai', 'abogado1@legal.ai'],
  },
  {
    title: 'Audiencia Amparo - EXP-2024-008',
    description: 'Audiencia urgente por acción de amparo de salud.',
    startOffsetDays: 1,
    durationHours: 1,
    case_number: 'EXP-2024-008',
    createdByEmail: 'abogado3@legal.ai',
    attendees: ['abogado3@legal.ai', 'cliente6@legal.ai'],
  },
  {
    title: 'Negociación - EXP-2024-009',
    description: 'Reunión con contraparte para revisar cláusulas del contrato.',
    startOffsetDays: 8,
    durationHours: 2,
    case_number: 'EXP-2024-009',
    createdByEmail: 'abogado2@legal.ai',
    attendees: ['abogado2@legal.ai', 'cliente7@legal.ai'],
  },
  {
    title: 'Citación Ejecutiva - EXP-2024-010',
    description: 'Audiencia de citación para la acción ejecutiva.',
    startOffsetDays: 6,
    durationHours: 1,
    case_number: 'EXP-2024-010',
    createdByEmail: 'coordinador@legal.ai',
    attendees: ['coordinador@legal.ai', 'cliente8@legal.ai'],
  },
  {
    title: 'Seguimiento Arbitraje - EXP-2024-011',
    description: 'Evaluación del cumplimiento del laudo arbitral.',
    startOffsetDays: 14,
    durationHours: 1,
    case_number: 'EXP-2024-011',
    createdByEmail: 'abogado1@legal.ai',
    attendees: ['abogado1@legal.ai', 'cliente5@legal.ai'],
  },
  {
    title: 'Cierre de Caso - EXP-2024-012',
    description: 'Revisión de documentación para archivo del expediente.',
    startOffsetDays: 2,
    durationHours: 1,
    case_number: 'EXP-2024-012',
    createdByEmail: 'abogado3@legal.ai',
    attendees: ['abogado3@legal.ai', 'cliente6@legal.ai'],
  },
];

const webhooksData = [
  {
    name: 'n8n_rag_query_webhook',
    description: 'Webhook para consultas RAG (Retrieval Augmented Generation)',
    webhook_url: 'https://tu-n8n-instance.com/webhook/rag-query',
    is_active: true,
  },
  {
    name: 'upload_to_drive',
    description: 'Webhook para subir archivos a Google Drive',
    webhook_url: 'https://tu-n8n-instance.com/webhook/upload-drive',
    is_active: true,
  },
  {
    name: 'whatsapp_messages',
    description: 'Webhook para recibir mensajes de WhatsApp',
    webhook_url: 'https://tu-n8n-instance.com/webhook/whatsapp',
    is_active: true,
  },
  {
    name: 'case_status_updates',
    description: 'Webhook para sincronizar cambios de estado de casos hacia N8N',
    webhook_url: 'https://tu-n8n-instance.com/webhook/case-status',
    is_active: true,
  },
  {
    name: 'calendar_sync',
    description: 'Webhook para sincronizar eventos del calendario con Google Calendar',
    webhook_url: 'https://tu-n8n-instance.com/webhook/calendar-sync',
    is_active: true,
  },
  {
    name: 'email_ingest',
    description: 'Webhook para indexar correos entrantes en Legal AI',
    webhook_url: 'https://tu-n8n-instance.com/webhook/email-ingest',
    is_active: false,
  },
];

const whatsappMessagesData = [
  {
    message_id: 'WA-MSG-001',
    chat_id: '5491112345678',
    from_number: '5491112345678',
    to_number: '5491123456789',
    message_content: 'Buenos días, necesito información sobre mi caso EXP-2024-001.',
    message_type: 'text',
    status: 'read',
    case_number: 'EXP-2024-001',
  },
  {
    message_id: 'WA-MSG-002',
    chat_id: '5491123456789',
    from_number: '5491123456789',
    to_number: '5491112345678',
    message_content: 'La audiencia está programada para el lunes a las 10:00 AM.',
    message_type: 'text',
    status: 'delivered',
    case_number: 'EXP-2024-002',
  },
  {
    message_id: 'WA-MSG-003',
    chat_id: '5491134567890',
    from_number: '5491134567890',
    to_number: '5491112345678',
    message_content: '¿Puedo enviar los documentos por WhatsApp?',
    message_type: 'text',
    status: 'sent',
    case_number: 'EXP-2024-003',
  },
  {
    message_id: 'WA-MSG-004',
    chat_id: '5491145678901',
    from_number: '5491145678901',
    to_number: '5491123456789',
    message_content: 'Envié las facturas médicas para el reclamo, ¿las recibieron?',
    message_type: 'text',
    status: 'delivered',
    case_number: 'EXP-2024-006',
  },
  {
    message_id: 'WA-MSG-005',
    chat_id: '5491156789012',
    from_number: '5491156789012',
    to_number: '5491123456789',
    message_content: 'La marca infractora volvió a publicar anuncios, necesitamos actuar.',
    message_type: 'text',
    status: 'read',
    case_number: 'EXP-2024-007',
  },
  {
    message_id: 'WA-MSG-006',
    chat_id: '5491167890123',
    from_number: '5491123456789',
    to_number: '5491167890123',
    message_content: 'Recordá llevar la documentación médica completa a la audiencia.',
    message_type: 'text',
    status: 'delivered',
    case_number: 'EXP-2024-008',
  },
  {
    message_id: 'WA-MSG-007',
    chat_id: '5491178901234',
    from_number: '5491178901234',
    to_number: '5491123456789',
    message_content: '¿Hay novedades del análisis del contrato?',
    message_type: 'text',
    status: 'sent',
    case_number: 'EXP-2024-009',
  },
  {
    message_id: 'WA-MSG-008',
    chat_id: '5491189012345',
    from_number: '5491123456789',
    to_number: '5491189012345',
    message_content: 'Se notificó al deudor, seguimos con el trámite ejecutivo.',
    message_type: 'text',
    status: 'read',
    case_number: 'EXP-2024-010',
  },
  {
    message_id: 'WA-MSG-009',
    chat_id: '5491190123456',
    from_number: '5491190123456',
    to_number: '5491123456789',
    message_content: 'Confirmo recepción del laudo arbitral firmado.',
    message_type: 'text',
    status: 'delivered',
    case_number: 'EXP-2024-011',
  },
  {
    message_id: 'WA-MSG-010',
    chat_id: '5491201234567',
    from_number: '5491123456789',
    to_number: '5491201234567',
    message_content: 'Queda agendado el encuentro para revisar la documentación fiscal.',
    message_type: 'text',
    status: 'sent',
    case_number: 'EXP-2024-012',
  },
];

async function ensureUsers() {
  console.log('👥 Creando usuarios de prueba...');
  const userMap = new Map();

  for (const userInfo of testUsers) {
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 100,
      emailFilter: userInfo.email,
    });

    if (listError) {
      throw new Error(`Error listando usuarios: ${listError.message}`);
    }

    let user = existingUsers.users.find((u) => u.email === userInfo.email);

    if (!user) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: userInfo.email,
        password: userInfo.password,
        email_confirm: true,
        user_metadata: { full_name: userInfo.fullName },
      });

      if (error || !data?.user) {
        throw new Error(`No se pudo crear el usuario ${userInfo.email}: ${error?.message}`);
      }
      user = data.user;
      console.log(`   ✅ Usuario creado: ${userInfo.email}`);
    } else {
      console.log(`   ℹ️  Usuario existente: ${userInfo.email}`);
    }

    userMap.set(userInfo.email, user.id);

    // Actualizar perfil con información adicional
    await supabase
      .from('profiles')
      .update({
        email: userInfo.email,
        full_name: userInfo.fullName,
        phone: userInfo.phone,
      })
      .eq('id', user.id);

    // Asignar roles
    for (const role of userInfo.roles) {
      await supabase
        .from('user_roles')
        .upsert({ user_id: user.id, role }, { onConflict: 'user_id,role' });
    }
  }

  return userMap;
}

async function seedCases(userMap) {
  const casesToInsert = casesData.map((item) => ({
    case_number: item.case_number,
    title: item.title,
    description: item.description,
    status: item.status,
    client_id: userMap.get(item.clientEmail),
    lawyer_id: userMap.get(item.lawyerEmail),
  }));

  const { data, error } = await supabase
    .from('cases')
    .upsert(casesToInsert, { onConflict: 'case_number' })
    .select('id, case_number');

  if (error) throw new Error(`Error insertando casos: ${error.message}`);

  const caseMap = new Map();
  data?.forEach((item) => caseMap.set(item.case_number, item.id));

  // Obtener cualquier caso existente que no haya sido devuelto (ya existían)
  if (caseMap.size < casesData.length) {
    const { data: existingCases, error: fetchError } = await supabase
      .from('cases')
      .select('id, case_number')
      .in('case_number', casesData.map((c) => c.case_number));

    if (fetchError) throw new Error(`Error obteniendo casos existentes: ${fetchError.message}`);

    existingCases?.forEach((item) => {
      caseMap.set(item.case_number, item.id);
    });
  }

  return caseMap;
}

async function upsertContact(contact, createdById) {
  const { data: existing, error: fetchError } = await supabase
    .from('contacts')
    .select('id')
    .eq('email', contact.email)
    .maybeSingle();

  if (fetchError) throw new Error(`Error verificando contacto ${contact.email}: ${fetchError.message}`);

  const payload = {
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    created_by: createdById,
  };

  if (existing) {
    await supabase.from('contacts').update(payload).eq('id', existing.id);
  } else {
    await supabase.from('contacts').insert(payload);
  }
}

async function upsertDocument(doc, caseId, uploadedById) {
  const { data: existing, error } = await supabase
    .from('documents')
    .select('id')
    .eq('file_name', doc.file_name)
    .maybeSingle();

  if (error) throw new Error(`Error verificando documento ${doc.file_name}: ${error.message}`);

  const payload = {
    file_name: doc.file_name,
    file_url: doc.file_url,
    file_type: doc.file_type,
    file_size: doc.file_size,
    case_id: caseId,
    uploaded_by: uploadedById,
  };

  if (existing) {
    await supabase.from('documents').update(payload).eq('id', existing.id);
  } else {
    await supabase.from('documents').insert(payload);
  }
}

async function upsertCalendarEvent(event, caseId, createdById, attendeesIds) {
  const { data: existing, error } = await supabase
    .from('calendar_events')
    .select('id')
    .eq('title', event.title)
    .maybeSingle();

  if (error) throw new Error(`Error verificando evento ${event.title}: ${error.message}`);

  const start = new Date(Date.now() + event.startOffsetDays * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + event.durationHours * 60 * 60 * 1000);

  const payload = {
    title: event.title,
    description: event.description,
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    attendees: attendeesIds,
    case_id: caseId,
    created_by: createdById,
  };

  if (existing) {
    await supabase.from('calendar_events').update(payload).eq('id', existing.id);
  } else {
    await supabase.from('calendar_events').insert(payload);
  }
}

async function upsertWebhook(webhook) {
  await supabase.from('n8n_webhooks').upsert(webhook, { onConflict: 'name' });
}

async function upsertWhatsappMessage(message, caseId) {
  await supabase
    .from('whatsapp_messages')
    .upsert(
      {
        message_id: message.message_id,
        chat_id: message.chat_id,
        from_number: message.from_number,
        to_number: message.to_number,
        message_content: message.message_content,
        message_type: message.message_type,
        status: message.status,
        case_id: caseId,
      },
      { onConflict: 'message_id' }
    );
}

async function main() {
  console.log('🚀 Generando datos de prueba para Legal AI');
  console.log('='.repeat(60));

  try {
    const userMap = await ensureUsers();
    console.log('\n📁 Usuarios listos:', userMap.size);

    // Casos
    console.log('\n📂 Generando casos...');
    const caseMap = await seedCases(userMap);
    console.log(`   ✅ Casos preparados: ${caseMap.size}`);

    // Contactos
    console.log('\n📇 Generando contactos...');
    for (const contact of contactsData) {
      await upsertContact(contact, userMap.get(contact.createdByEmail));
      console.log(`   ✅ ${contact.name}`);
    }

    // Documentos
    console.log('\n📄 Generando documentos...');
    for (const doc of documentsData) {
      await upsertDocument(doc, caseMap.get(doc.case_number), userMap.get(doc.uploadedByEmail));
      console.log(`   ✅ ${doc.file_name}`);
    }

    // Eventos
    console.log('\n🗓️  Generando eventos...');
    for (const event of calendarEventsData) {
      const attendeesIds = event.attendees.map((email) => ({
        email,
        id: userMap.get(email),
      }));
      await upsertCalendarEvent(
        event,
        caseMap.get(event.case_number),
        userMap.get(event.createdByEmail),
        attendeesIds
      );
      console.log(`   ✅ ${event.title}`);
    }

    // Webhooks
    console.log('\n🔗 Configurando webhooks...');
    for (const webhook of webhooksData) {
      await upsertWebhook(webhook);
      console.log(`   ✅ ${webhook.name}`);
    }

    // Mensajes de WhatsApp
    console.log('\n💬 Generando mensajes de WhatsApp...');
    for (const message of whatsappMessagesData) {
      await upsertWhatsappMessage(message, caseMap.get(message.case_number));
      console.log(`   ✅ ${message.message_id}`);
    }

    console.log('\n✅ Datos de prueba generados correctamente');
    console.log('='.repeat(60));
    console.log('\nPuedes iniciar sesión con:');
    console.log('   • admin@legal.ai / Test123456 (Admin)');
    console.log('   • abogado1@legal.ai / Test123456 (Lawyer)');
    console.log('   • cliente1@legal.ai / Test123456 (Client)');
    console.log('\n🎉 Todas las pantallas tendrán información de prueba.');
  } catch (error) {
    console.error('\n❌ Error generando datos de prueba:');
    console.error(error);
    process.exit(1);
  }
}

main().catch(console.error);

