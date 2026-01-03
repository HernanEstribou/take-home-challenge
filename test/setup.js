import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, unlinkSync } from 'fs';

// Obtener el directorio raíz del proyecto
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Configurar variables de entorno para testing
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';
process.env.POKEAPI_URL = 'https://pokeapi.co/api/v2';
process.env.PORT = '5174';

// Setup que se ejecuta antes de todos los tests
export default async function globalSetup() {
  console.log('🔧 Setting up test database...');

  const testDbPath = join(rootDir, 'test.db');

  // Eliminar la base de datos de test si existe
  if (existsSync(testDbPath)) {
    unlinkSync(testDbPath);
  }

  // Ejecutar migraciones de Prisma para crear la estructura
  try {
    execSync('npx prisma migrate deploy', {
      cwd: rootDir,
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: 'file:./test.db' },
    });
    console.log('✅ Test database ready!');
  } catch (error) {
    console.error('❌ Error setting up test database:', error);
    throw error;
  }
}
