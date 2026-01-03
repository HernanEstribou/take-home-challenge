import request from 'supertest';
import app from '../src/app.js';
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  afterAll,
} from '@jest/globals';
import pokemonClient from '../src/clients/pokemon.client.js';
import {
  cleanDatabase,
  createTestUser,
  closePrismaConnection,
} from './helpers.js';

// Cerrar conexión de Prisma después de TODOS los tests
afterAll(async () => {
  await closePrismaConnection();
});

describe('GET /users', () => {
  beforeEach(async () => {
    await cleanDatabase();
    // Crear un usuario de prueba para el GET
    await createTestUser({
      username: 'john',
      email: 'john@example.com',
      password: 'password123',
    });
  });

  test('Debería responder con un código de estado 200', async () => {
    const response = await request(app).get('/users').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    const user = response.body[0];
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('email');
    expect(user).not.toHaveProperty('password');
  });
});

describe('GET /users/:id', () => {
  let testUser;

  beforeEach(async () => {
    await cleanDatabase();
    // Crear un usuario de prueba con pokemonIds
    testUser = await createTestUser({
      username: 'ash',
      email: 'ash@pokemon.com',
      password: 'pikachu123',
      pokemonIds: '[1, 25, 150]',
    });

    // Mock del cliente de Pokemon
    // Spy en la función getPokemonById del cliente de pokemon
    jest
      .spyOn(pokemonClient, 'getPokemonById')
      .mockImplementation((pokemonIds) => {
        // Nombres de pokemons para testing
        const pokemonNames = {
          1: 'bulbasaur',
          2: 'ivysaur',
          3: 'venusaur',
          4: 'charmander',
          5: 'charmeleon',
          6: 'charizard',
          7: 'squirtle',
          8: 'wartortle',
          9: 'blastoise',
          10: 'caterpie',
          25: 'pikachu',
          150: 'mewtwo',
        };

        // Devolver un array de pokemons basado en los IDs proporcionados
        return Promise.resolve(
          pokemonIds.map((id) => ({
            id,
            name: pokemonNames[id] || `pokemon-${id}`,
          })),
        );
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Debería devolver un usuario con sus pokemons', async () => {
    const response = await request(app)
      .get(`/users/${testUser.id}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('pokemons');
    expect(Array.isArray(response.body.pokemons)).toBe(true);

    // Verificar que devuelve los pokemons correctos
    expect(response.body.pokemons.length).toBe(3);

    // Verificar que cada pokemon tiene id y name
    response.body.pokemons.forEach((pokemon) => {
      expect(pokemon).toHaveProperty('id');
      expect(pokemon).toHaveProperty('name');
    });
  });

  test('Debería devolver 404 si el usuario no existe', async () => {
    const response = await request(app).get('/users/999').expect(404);

    expect(response.body).toHaveProperty('message', 'User not found');
  });
});

describe('POST /users', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  test('Debería crear un nuevo usuario exitosamente', async () => {
    const newUser = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'securePassword123',
      pokemonIds: [1, 25],
    };

    const response = await request(app)
      .post('/users')
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username', 'newuser');
    expect(response.body).toHaveProperty('email', 'newuser@example.com');
    expect(response.body).not.toHaveProperty('password'); // No debe devolver password
  });

  test('Debería fallar si falta el username (validación)', async () => {
    const invalidUser = {
      email: 'test@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/users')
      .send(invalidUser)
      .expect(400);

    expect(response.body).toHaveProperty('message', 'Validation failed');
    expect(response.body).toHaveProperty('errors');
  });

  test('Debería fallar si falta el email (validación)', async () => {
    const invalidUser = {
      username: 'testuser',
      password: 'password123',
    };

    const response = await request(app)
      .post('/users')
      .send(invalidUser)
      .expect(400);

    expect(response.body).toHaveProperty('message', 'Validation failed');
    expect(response.body).toHaveProperty('errors');
  });

  test('Debería fallar si falta el password (validación)', async () => {
    const invalidUser = {
      username: 'testuser',
      email: 'test@example.com',
    };

    const response = await request(app)
      .post('/users')
      .send(invalidUser)
      .expect(400);

    expect(response.body).toHaveProperty('message', 'Validation failed');
    expect(response.body).toHaveProperty('errors');
  });

  test('Debería crear usuario sin pokemonIds (opcional)', async () => {
    const newUser = {
      username: 'simpleuser',
      email: 'simple@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/users')
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username', 'simpleuser');
  });
});
