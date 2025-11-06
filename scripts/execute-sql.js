#!/usr/bin/env node

/**
 * Script para ejecutar SQL en Supabase usando la API REST
 * Usa el endpoint de PostgREST para ejecutar funciones SQL
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

// Función para ejecutar SQL usando la API de Supabase
// Nota: Supabase no tiene un endpoint REST directo para SQL
// Necesitamos usar el Management API o ejecutar SQL directamente
async function executeSQL(sql) {
  console.log('📝 Intentando ejecutar SQL...');
  console.log(`   SQL length: ${sql.length} caracteres`);
  
  // Intentar usar el endpoint de SQL (si existe)
  // Nota: Esto generalmente no funciona por seguridad
  try {
    const response = await makeRequest(
      `${PROJECT_URL}/rest/v1/rpc/exec_sql`,
      { method: 'POST' },
      { query: sql }
    );
    
    if (response.status === 200 || response.status === 201) {
      console.log('✅ SQL ejecutado exitosamente');
      return true;
    }
  } catch (error) {
    console.log('⚠️  Endpoint RPC no disponible');
  }
  
  // Alternativa: usar Management API
  // Esto requiere autenticación diferente
  console.log('⚠️  No se puede ejecutar SQL directamente desde la API REST');
  console.log('   Supabase requiere ejecutar SQL desde el Dashboard o usando psql');
  
  return false;
}

// Función principal
async function main() {
  console.log('🚀 Ejecutando Migraciones SQL en Supabase');
  console.log('==========================================\n');
  
  // Leer archivo SQL
  const sqlFile = path.join(__dirname, 'migrate-database.sql');
  if (!fs.existsSync(sqlFile)) {
    console.error('❌ No se encontró el archivo SQL:', sqlFile);
    process.exit(1);
  }
  
  const sql = fs.readFileSync(sqlFile, 'utf8');
  console.log('✅ Archivo SQL leído correctamente');
  console.log(`   Líneas: ${sql.split('\n').length}`);
  console.log(`   Caracteres: ${sql.length}\n`);
  
  // Intentar ejecutar
  const result = await executeSQL(sql);
  
  if (!result) {
    console.log('\n📋 INSTRUCCIONES PARA EJECUTAR MANUALMENTE:');
    console.log('==========================================\n');
    console.log('1. Abre el SQL Editor de Supabase:');
    console.log(`   https://supabase.com/dashboard/project/${PROJECT_ID}/sql/new\n`);
    console.log('2. Copia el contenido del archivo:');
    console.log(`   ${sqlFile}\n`);
    console.log('3. Pega y ejecuta el SQL completo\n');
    console.log('O usa este comando para copiar el SQL:');
    console.log(`   cat ${sqlFile}\n`);
  }
  
  console.log('✅ Proceso completado');
}

main().catch(console.error);

