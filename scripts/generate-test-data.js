#!/usr/bin/env node

/**
 * Script para generar datos de prueba para todas las tablas
 * Genera datos realistas para un sistema legal
 */

import https from 'https';

const PROJECT_URL = 'https://bkpgkenxyretsrxxrxfb.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcGdrZW54eXJldHNyeHhyeGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI4NDI1MCwiZXhwIjoyMDc3ODYwMjUwfQ.baaSgzhLryrAJLULhkTnzx7J0Q9W8Zov187BUP1CowA';

// Función para hacer peticiones HTTPS
function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation',
        ...options.headers
      }
    };

    const req = https.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, headers: res.headers, data: parsed, raw: body });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: body, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Datos de prueba
const testData = {
  // Perfiles de usuarios (abogados y clientes)
  profiles: [
    { email: 'abogado1@legal.ai', full_name: 'Dr. Carlos Mendoza', phone: '+54 11 1234-5678' },
    { email: 'abogado2@legal.ai', full_name: 'Dra. María González', phone: '+54 11 2345-6789' },
    { email: 'cliente1@legal.ai', full_name: 'Juan Pérez', phone: '+54 11 3456-7890' },
    { email: 'cliente2@legal.ai', full_name: 'Ana Martínez', phone: '+54 11 4567-8901' },
    { email: 'cliente3@legal.ai', full_name: 'Roberto Sánchez', phone: '+54 11 5678-9012' },
  ],

  // Casos legales
  cases: [
    {
      case_number: 'EXP-2024-001',
      title: 'Divorcio Contencioso - Pérez vs Pérez',
      description: 'Proceso de divorcio contencioso con disputa sobre bienes gananciales y custodia de menores.',
      status: 'in_progress',
    },
    {
      case_number: 'EXP-2024-002',
      title: 'Accidente de Tránsito - Martínez',
      description: 'Reclamo por daños y perjuicios derivados de accidente de tránsito. Lesiones leves y daños materiales.',
      status: 'new',
    },
    {
      case_number: 'EXP-2024-003',
      title: 'Contrato Laboral - Sánchez',
      description: 'Despido injustificado. Reclamo por indemnización y vacaciones no gozadas.',
      status: 'in_progress',
    },
    {
      case_number: 'EXP-2024-004',
      title: 'Sucesión - Familia Rodríguez',
      description: 'Proceso sucesorio con testamento. Distribución de bienes entre herederos.',
      status: 'resolved',
    },
    {
      case_number: 'EXP-2024-005',
      title: 'Contrato Comercial - Empresa ABC',
      description: 'Incumplimiento contractual. Reclamo por daños y perjuicios.',
      status: 'on_hold',
    },
  ],

  // Contactos
  contacts: [
    { name: 'Dr. Luis Fernández', email: 'luis.fernandez@legal.ai', phone: '+54 11 6789-0123' },
    { name: 'Dra. Patricia López', email: 'patricia.lopez@legal.ai', phone: '+54 11 7890-1234' },
    { name: 'Testigo - María García', email: 'maria.garcia@email.com', phone: '+54 11 8901-2345' },
    { name: 'Perito - Dr. Jorge Ramírez', email: 'jorge.ramirez@peritos.com', phone: '+54 11 9012-3456' },
    { name: 'Cliente Potencial - Sofía Torres', email: 'sofia.torres@email.com', phone: '+54 11 0123-4567' },
  ],

  // Documentos
  documents: [
    { file_name: 'Demanda_Inicial_EXP-001.pdf', file_url: 'https://example.com/docs/demanda-001.pdf', file_type: 'application/pdf', file_size: 245760 },
    { file_name: 'Contrato_Laboral_EXP-003.pdf', file_url: 'https://example.com/docs/contrato-003.pdf', file_type: 'application/pdf', file_size: 189440 },
    { file_name: 'Testamento_EXP-004.pdf', file_url: 'https://example.com/docs/testamento-004.pdf', file_type: 'application/pdf', file_size: 153600 },
    { file_name: 'Pericia_Medica_EXP-002.pdf', file_url: 'https://example.com/docs/pericia-002.pdf', file_type: 'application/pdf', file_size: 307200 },
    { file_name: 'Sentencia_EXP-004.pdf', file_url: 'https://example.com/docs/sentencia-004.pdf', file_type: 'application/pdf', file_size: 204800 },
  ],

  // Eventos del calendario
  calendar_events: [
    {
      title: 'Audiencia Preliminar - EXP-001',
      description: 'Primera audiencia para el caso de divorcio. Presentación de pruebas.',
      start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días desde ahora
      end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // +2 horas
      attendees: [{ email: 'abogado1@legal.ai', name: 'Dr. Carlos Mendoza' }, { email: 'cliente1@legal.ai', name: 'Juan Pérez' }],
    },
    {
      title: 'Reunión con Cliente - EXP-002',
      description: 'Revisión de documentación del accidente y estrategia legal.',
      start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días desde ahora
      end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString(), // +1 hora
      attendees: [{ email: 'abogado2@legal.ai', name: 'Dra. María González' }, { email: 'cliente2@legal.ai', name: 'Ana Martínez' }],
    },
    {
      title: 'Mediación - EXP-003',
      description: 'Sesión de mediación para intentar acuerdo extrajudicial.',
      start_time: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 días desde ahora
      end_time: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // +3 horas
      attendees: [{ email: 'abogado1@legal.ai', name: 'Dr. Carlos Mendoza' }, { email: 'cliente3@legal.ai', name: 'Roberto Sánchez' }],
    },
  ],

  // Webhooks N8N
  n8n_webhooks: [
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
  ],

  // Mensajes de WhatsApp
  whatsapp_messages: [
    {
      message_id: 'WA-MSG-001',
      chat_id: '5491112345678',
      from_number: '5491112345678',
      to_number: '5491123456789',
      message_content: 'Buenos días, necesito información sobre mi caso EXP-2024-001',
      message_type: 'text',
      status: 'read',
    },
    {
      message_id: 'WA-MSG-002',
      chat_id: '5491123456789',
      from_number: '5491123456789',
      to_number: '5491112345678',
      message_content: 'Hola, te confirmo que la audiencia está programada para el próximo lunes a las 10:00 AM',
      message_type: 'text',
      status: 'delivered',
    },
    {
      message_id: 'WA-MSG-003',
      chat_id: '5491134567890',
      from_number: '5491134567890',
      to_number: '5491123456789',
      message_content: '¿Puedo enviar los documentos por WhatsApp?',
      message_type: 'text',
      status: 'sent',
    },
  ],
};

// Función para crear usuario en Supabase Auth
async function createUser(email, password, fullName) {
  const userData = {
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName }
  };

  const response = await makeRequest(
    `${PROJECT_URL}/auth/v1/admin/users`,
    { method: 'POST' },
    userData
  );

  if (response.status === 200 || response.status === 201) {
    return response.data;
  }
  
  // Si el usuario ya existe, obtenerlo
  if (response.status === 422) {
    const getResponse = await makeRequest(
      `${PROJECT_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
      { method: 'GET' }
    );
    if (getResponse.status === 200 && getResponse.data?.users?.length > 0) {
      return getResponse.data.users[0];
    }
  }
  
  return null;
}

// Función para obtener usuarios existentes
async function getUsers() {
  console.log('📋 Obteniendo usuarios existentes...');
  
  // Obtener desde auth.users usando admin API
  const authResponse = await makeRequest(
    `${PROJECT_URL}/auth/v1/admin/users`,
    { method: 'GET' }
  );
  
  if (authResponse.status === 200 && authResponse.data?.users) {
    return authResponse.data.users.map(u => ({ id: u.id, email: u.email }));
  }

  // Fallback: intentar obtener desde profiles
  const profilesResponse = await makeRequest(
    `${PROJECT_URL}/rest/v1/profiles?select=id,email`,
    { method: 'GET' }
  );
  
  if (profilesResponse.status === 200 && profilesResponse.data) {
    return profilesResponse.data;
  }

  return [];
}

// Función para insertar datos
async function insertData(table, data, userIds = null) {
  console.log(`\n📝 Insertando datos en ${table}...`);
  
  let inserted = 0;
  let errors = 0;

  for (const item of data) {
    try {
      // Si necesita user_id, asignar uno aleatorio de los disponibles
      if (userIds && (item.client_id === undefined || item.lawyer_id === undefined || item.created_by === undefined || item.uploaded_by === undefined)) {
        if (userIds.length === 0) {
          console.log(`⚠️  No hay usuarios disponibles para ${table}, saltando...`);
          continue;
        }
        
        // Asignar IDs según el tipo de tabla
        if (table === 'cases') {
          if (!item.client_id) item.client_id = userIds[Math.floor(Math.random() * userIds.length)].id;
          if (!item.lawyer_id) item.lawyer_id = userIds[Math.floor(Math.random() * userIds.length)].id;
        } else if (table === 'contacts' || table === 'calendar_events') {
          if (!item.created_by) item.created_by = userIds[Math.floor(Math.random() * userIds.length)].id;
        } else if (table === 'documents') {
          if (!item.uploaded_by) item.uploaded_by = userIds[Math.floor(Math.random() * userIds.length)].id;
        }
      }

      const response = await makeRequest(
        `${PROJECT_URL}/rest/v1/${table}`,
        { method: 'POST' },
        item
      );

      if (response.status === 201 || response.status === 200) {
        inserted++;
        console.log(`   ✅ ${item.name || item.title || item.file_name || item.case_number || item.message_id || 'Item'}`);
      } else {
        errors++;
        console.log(`   ❌ Error: ${response.status} - ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      errors++;
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log(`   📊 Insertados: ${inserted}, Errores: ${errors}`);
  return { inserted, errors };
}

// Función principal
async function main() {
  console.log('🚀 Generando datos de prueba para Legal AI');
  console.log('='.repeat(50));
  console.log('');

  try {
    // Obtener usuarios existentes
    let users = await getUsers();
    console.log(`✅ Encontrados ${users.length} usuarios`);
    
    // Si no hay usuarios, crear usuarios de prueba
    if (users.length === 0) {
      console.log('\n📝 Creando usuarios de prueba...');
      console.log('='.repeat(50));
      
      const testUsers = [
        { email: 'abogado1@legal.ai', password: 'Test123456', fullName: 'Dr. Carlos Mendoza' },
        { email: 'abogado2@legal.ai', password: 'Test123456', fullName: 'Dra. María González' },
        { email: 'cliente1@legal.ai', password: 'Test123456', fullName: 'Juan Pérez' },
        { email: 'cliente2@legal.ai', password: 'Test123456', fullName: 'Ana Martínez' },
        { email: 'cliente3@legal.ai', password: 'Test123456', fullName: 'Roberto Sánchez' },
      ];

      for (const userData of testUsers) {
        console.log(`   Creando usuario: ${userData.email}...`);
        const createdUser = await createUser(userData.email, userData.password, userData.fullName);
        if (createdUser) {
          console.log(`   ✅ Usuario creado: ${userData.email}`);
        } else {
          console.log(`   ⚠️  No se pudo crear: ${userData.email}`);
        }
      }

      // Esperar un momento para que se creen los perfiles
      console.log('\n⏳ Esperando que se creen los perfiles...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Obtener usuarios nuevamente
      users = await getUsers();
      console.log(`✅ Total de usuarios: ${users.length}`);
    }

    if (users.length === 0) {
      console.log('❌ No se pudieron crear usuarios. Verifica las políticas RLS.');
      return;
    }

    const userIds = users.map(u => ({ id: u.id, email: u.email }));

    // Insertar datos en orden (respetando dependencias)
    console.log('\n📦 Insertando datos de prueba...');
    console.log('='.repeat(50));

    // 1. Webhooks (no dependen de nada)
    await insertData('n8n_webhooks', testData.n8n_webhooks);

    // 2. Contactos (dependen de usuarios)
    await insertData('contacts', testData.contacts, userIds);

    // 3. Casos (dependen de usuarios)
    await insertData('cases', testData.cases, userIds);

    // 4. Obtener casos creados para vincular documentos
    const casesResponse = await makeRequest(
      `${PROJECT_URL}/rest/v1/cases?select=id,case_number`,
      { method: 'GET' }
    );
    const cases = casesResponse.data || [];

    // 5. Documentos (dependen de casos y usuarios)
    if (cases.length > 0) {
      const documentsWithCases = testData.documents.map((doc, index) => ({
        ...doc,
        case_id: cases[index % cases.length]?.id || null,
      }));
      await insertData('documents', documentsWithCases, userIds);
    } else {
      await insertData('documents', testData.documents, userIds);
    }

    // 6. Eventos del calendario (dependen de casos y usuarios)
    if (cases.length > 0) {
      const eventsWithCases = testData.calendar_events.map((event, index) => ({
        ...event,
        case_id: cases[index % cases.length]?.id || null,
      }));
      await insertData('calendar_events', eventsWithCases, userIds);
    } else {
      await insertData('calendar_events', testData.calendar_events, userIds);
    }

    // 7. Mensajes de WhatsApp (dependen de casos)
    if (cases.length > 0) {
      const messagesWithCases = testData.whatsapp_messages.map((msg, index) => ({
        ...msg,
        case_id: cases[index % cases.length]?.id || null,
      }));
      await insertData('whatsapp_messages', messagesWithCases);
    } else {
      await insertData('whatsapp_messages', testData.whatsapp_messages);
    }

    console.log('\n✅ Datos de prueba generados exitosamente!');
    console.log('='.repeat(50));
    console.log('\n📊 Resumen:');
    console.log(`   - Webhooks: ${testData.n8n_webhooks.length}`);
    console.log(`   - Contactos: ${testData.contacts.length}`);
    console.log(`   - Casos: ${testData.cases.length}`);
    console.log(`   - Documentos: ${testData.documents.length}`);
    console.log(`   - Eventos: ${testData.calendar_events.length}`);
    console.log(`   - Mensajes WhatsApp: ${testData.whatsapp_messages.length}`);
    console.log('\n🎉 ¡Listo para probar todas las pantallas!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Asegúrate de que:');
    console.error('   1. Las tablas estén creadas (ejecuta migrate-database.sql)');
    console.error('   2. Haya usuarios en la base de datos');
    console.error('   3. Las políticas RLS permitan la inserción');
    process.exit(1);
  }
}

// Ejecutar
main().catch(console.error);

