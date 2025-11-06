#!/usr/bin/env node

/**
 * Script para crear un usuario de prueba en Supabase
 * Usa la API de Supabase con service role key
 */

import https from 'https';

const PROJECT_URL = 'https://bkpgkenxyretsrxxrxfb.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcGdrZW54eXJldHNyeHhyeGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI4NDI1MCwiZXhwIjoyMDc3ODYwMjUwfQ.baaSgzhLryrAJLULhkTnzx7J0Q9W8Zov187BUP1CowA';

// Datos del usuario de prueba
const testUser = {
  email: 'test@legal.ai',
  password: 'Test123456',
  email_confirm: true, // Confirmar email automáticamente
  user_metadata: {
    full_name: 'Usuario de Prueba'
  }
};

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

// Función principal
async function createTestUser() {
  console.log('🚀 Creando usuario de prueba en Supabase...');
  console.log('='.repeat(50));
  console.log('');
  console.log('📋 Datos del usuario:');
  console.log(`   Email: ${testUser.email}`);
  console.log(`   Password: ${testUser.password}`);
  console.log(`   Nombre: ${testUser.user_metadata.full_name}`);
  console.log('');

  try {
    // Crear usuario en Supabase Auth
    console.log('📝 Creando usuario en Supabase Auth...');
    const createResponse = await makeRequest(
      `${PROJECT_URL}/auth/v1/admin/users`,
      { method: 'POST' },
      testUser
    );

    if (createResponse.status !== 200 && createResponse.status !== 201) {
      // Si el usuario ya existe, intentar actualizarlo
      if (createResponse.status === 422 || createResponse.data?.message?.includes('already')) {
        console.log('⚠️  El usuario ya existe. Intentando actualizar...');
        
        // Obtener el usuario existente
        const getResponse = await makeRequest(
          `${PROJECT_URL}/auth/v1/admin/users?email=${encodeURIComponent(testUser.email)}`,
          { method: 'GET' }
        );

        if (getResponse.status === 200 && getResponse.data?.users?.length > 0) {
          const userId = getResponse.data.users[0].id;
          console.log(`✅ Usuario encontrado: ${userId}`);
          console.log('');
          console.log('📋 CREDENCIALES DE PRUEBA:');
          console.log('='.repeat(50));
          console.log(`Email: ${testUser.email}`);
          console.log(`Password: ${testUser.password}`);
          console.log('');
          console.log('🔗 URL de login: https://legal.aiporvos.com/auth');
          console.log('');
          return;
        }
      }
      
      throw new Error(`Error al crear usuario: ${createResponse.status} - ${JSON.stringify(createResponse.data)}`);
    }

    const user = createResponse.data;
    console.log('✅ Usuario creado exitosamente!');
    console.log(`   User ID: ${user.id}`);
    console.log('');

    // El perfil y rol se crearán automáticamente por el trigger
    console.log('✅ Perfil y rol se crearán automáticamente por el trigger');
    console.log('');

    console.log('📋 CREDENCIALES DE PRUEBA:');
    console.log('='.repeat(50));
    console.log(`Email: ${testUser.email}`);
    console.log(`Password: ${testUser.password}`);
    console.log('');
    console.log('🔗 URL de login: https://legal.aiporvos.com/auth');
    console.log('');
    console.log('✅ Usuario listo para usar!');

  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
    console.error('');
    console.error('💡 Alternativa: Crea el usuario manualmente en Supabase Dashboard:');
    console.error('   1. Ve a: https://supabase.com/dashboard/project/bkpgkenxyretsrxxrxfb/auth/users');
    console.error('   2. Click en "Add user"');
    console.error('   3. Email: test@legal.ai');
    console.error('   4. Password: Test123456');
    console.error('   5. Auto Confirm User: YES');
    console.error('   6. Click en "Create user"');
    process.exit(1);
  }
}

// Ejecutar
createTestUser().catch(console.error);

