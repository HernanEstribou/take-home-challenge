import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

// Helper para limpiar la base de datos entre tests
export async function cleanDatabase() {
  await prisma.user.deleteMany({});
}

// Helper para crear usuarios de prueba
export async function createTestUser(data = {}) {
  return await prisma.user.create({
    data: {
      username: data.username || 'testuser',
      email: data.email || 'test@example.com',
      password: data.password || 'password123',
      pokemonIds: data.pokemonIds || '[]',
    },
  });
}

// Helper para cerrar la conexión de Prisma
export async function closePrismaConnection() {
  await prisma.$disconnect();
}

export { prisma };
