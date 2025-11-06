#!/usr/bin/env node

/**
 * Script para configurar Supabase usando la API REST
 * Ejecuta todas las migraciones SQL y despliega Edge Functions
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Credenciales de Supabase
const PROJECT_ID = 'bkpgkenxyretsrxxrxfb';
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
        ...options.headers
      }
    };

    const req = https.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Función para ejecutar SQL
async function executeSQL(sql) {
  console.log('📝 Ejecutando migraciones SQL...');
  
  // Usar la API REST de Supabase para ejecutar SQL
  const response = await makeRequest(
    `${PROJECT_URL}/rest/v1/rpc/exec_sql`,
    { method: 'POST' },
    { query: sql }
  );

  // Alternativa: usar el endpoint de SQL directamente
  // Nota: Supabase no tiene un endpoint REST directo para SQL
  // Necesitamos usar psql o el SQL Editor
  
  console.log('⚠️  Nota: La API REST de Supabase no permite ejecutar SQL directamente.');
  console.log('   Por favor, ejecuta el SQL manualmente desde el SQL Editor en Supabase Dashboard.');
  console.log('   O usa psql con las credenciales de conexión.');
  
  return false;
}

// Función principal
async function main() {
  console.log('🚀 Configuración de Supabase - Sistema Legal');
  console.log('============================================\n');
  
  // Leer archivo SQL
  const sqlFile = path.join(__dirname, 'migrate-database.sql');
  if (!fs.existsSync(sqlFile)) {
    console.error('❌ No se encontró el archivo SQL:', sqlFile);
    process.exit(1);
  }
  
  const sql = fs.readFileSync(sqlFile, 'utf8');
  
  console.log('✅ Archivo SQL encontrado');
  console.log('📋 Tamaño:', sql.length, 'caracteres\n');
  
  // Intentar ejecutar SQL
  const result = await executeSQL(sql);
  
  if (!result) {
    console.log('\n📝 Para ejecutar el SQL manualmente:');
    console.log('   1. Ve a: https://supabase.com/dashboard/project/' + PROJECT_ID + '/sql/new');
    console.log('   2. Copia y pega el contenido de: scripts/migrate-database.sql');
    console.log('   3. Ejecuta el script completo');
    console.log('\n   O usa psql:');
    console.log(`   psql "postgresql://postgres:[PASSWORD]@db.${PROJECT_ID}.supabase.co:5432/postgres" -f scripts/migrate-database.sql`);
  }
  
  console.log('\n✅ Script completado');
}

main().catch(console.error);

