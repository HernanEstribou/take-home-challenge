import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, unlinkSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Teardown que se ejecuta después de todos los tests
export default async function globalTeardown() {
  console.log('🧹 Cleaning up test database...');

  const testDbPath = join(rootDir, 'test.db');

  // Esperar un poco para que se cierren las conexiones
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Eliminar la base de datos de test
  if (existsSync(testDbPath)) {
    unlinkSync(testDbPath);
    console.log('✅ Test database removed!');
  }
}
