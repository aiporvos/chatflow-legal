#!/usr/bin/env node

/**
 * Script para ejecutar SQL en Supabase usando la API REST
 * Divide el SQL en comandos individuales y los ejecuta uno por uno
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

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
          resolve({ status: res.statusCode, headers: res.headers, data: parsed, raw: body });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: body, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      if (typeof data === 'string') {
        req.write(data);
      } else {
        req.write(JSON.stringify(data));
      }
    }
    req.end();
  });
}

// Función para ejecutar comandos SQL individuales usando la API REST
// Nota: Supabase no permite ejecutar SQL arbitrario desde la API REST
// Solo podemos ejecutar funciones RPC o queries específicas
async function executeSQLCommand(command) {
  // Limpiar el comando
  command = command.trim();
  if (!command || command.startsWith('--')) {
    return { success: true, skipped: true };
  }

  // Intentar ejecutar como función RPC si es posible
  // Pero Supabase no tiene un endpoint genérico para SQL arbitrario
  
  // Por ahora, solo loguear
  console.log(`   ⚠️  No se puede ejecutar: ${command.substring(0, 50)}...`);
  return { success: false, reason: 'Supabase no permite SQL arbitrario desde API REST' };
}

// Función principal
async function main() {
  console.log('🚀 Ejecutando Migraciones SQL en Supabase');
  console.log('='.repeat(50));
  console.log('');
  
  // Leer archivo SQL
  const sqlFile = path.join(__dirname, 'migrate-database.sql');
  if (!fs.existsSync(sqlFile)) {
    console.error('❌ No se encontró el archivo SQL:', sqlFile);
    process.exit(1);
  }
  
  const sql = fs.readFileSync(sqlFile, 'utf8');
  console.log('✅ Archivo SQL leído correctamente');
  console.log(`   Líneas: ${sql.split('\n').length}`);
  console.log(`   Caracteres: ${sql.length}`);
  console.log('');
  
  console.log('⚠️  IMPORTANTE: Supabase no permite ejecutar SQL arbitrario desde la API REST');
  console.log('   por razones de seguridad.');
  console.log('');
  console.log('📋 DEBES EJECUTAR EL SQL MANUALMENTE:');
  console.log('='.repeat(50));
  console.log('');
  console.log('1. Abre el SQL Editor de Supabase:');
  console.log(`   https://supabase.com/dashboard/project/${PROJECT_ID}/sql/new`);
  console.log('');
  console.log('2. Copia el contenido del archivo:');
  console.log(`   ${sqlFile}`);
  console.log('');
  console.log('3. Pega y ejecuta el SQL completo');
  console.log('');
  console.log('El script usa CREATE IF NOT EXISTS y CREATE OR REPLACE,');
  console.log('por lo que es seguro ejecutarlo incluso si las tablas ya existen.');
  console.log('');
  
  // Mostrar el SQL completo para copiar
  console.log('📄 Contenido del SQL:');
  console.log('='.repeat(50));
  console.log(sql);
  console.log('='.repeat(50));
}

main().catch(console.error);

