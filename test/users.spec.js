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

describe('PUT /users/:id', () => {
  let testUser;

  beforeEach(async () => {
    await cleanDatabase();
    // Crear un usuario de prueba para actualizar
    testUser = await createTestUser({
      username: 'originaluser',
      email: 'original@example.com',
      password: 'originalPassword123',
      pokemonIds: '[1, 25]',
    });
  });

  test('Debería actualizar un usuario existente exitosamente', async () => {
    const updateData = {
      username: 'updatedName',
      email: 'updated@example.com',
    };

    const response = await request(app)
      .put(`/users/${testUser.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toHaveProperty('id', testUser.id);
    expect(response.body).toHaveProperty('username', 'updatedName');
    expect(response.body).toHaveProperty('email', 'updated@example.com');
    expect(response.body).not.toHaveProperty('password');
  });

  test('Debería devolver 404 si el usuario no existe', async () => {
    const updateData = {
      username: 'updatedName',
      email: 'updated@example.com',
    };

    const response = await request(app)
      .put('/users/999')
      .send(updateData)
      .expect(404);

    expect(response.body).toHaveProperty('message', 'User not found');
  });

  test('Debería fallar si los datos son inválidos', async () => {
    const invalidData = {
      username: '', // Username vacío es inválido
    };

    const response = await request(app)
      .put(`/users/${testUser.id}`)
      .send(invalidData)
      .expect(400);

    expect(response.body).toHaveProperty('message', 'Validation failed');
    expect(response.body).toHaveProperty('errors');
  });
});

describe('PUT /users/:id/pokemon', () => {
  let testUser;

  beforeEach(async () => {
    await cleanDatabase();
    // Crear un usuario de prueba para actualizar
    testUser = await createTestUser({
      username: 'originaluser',
      email: 'original@example.com',
      password: 'originalPassword123',
      pokemonIds: '[1, 25]',
    });
  });

  test('Debería actualizar los ids de pokemons de un usuario correctamente', async () => {
    const updateData = {
      pokemonIds: [4, 7],
    };

    const response = await request(app)
      .put(`/users/${testUser.id}/pokemon`)
      .send(updateData)
      .expect(200);

    expect(response.body).toHaveProperty('id', testUser.id);
    expect(response.body).toHaveProperty('username', 'originaluser');
    expect(response.body).toHaveProperty('pokemonIds');
    expect(Array.isArray(response.body.pokemonIds)).toBe(true);
    expect(response.body.pokemonIds).toEqual([4, 7]);
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('email');
  });

  test('Debería devolver 404 si el usuario no existe', async () => {
    const updateData = {
      pokemonIds: [4, 7],
    };

    const response = await request(app)
      .put('/users/999/pokemon')
      .send(updateData)
      .expect(404);

    expect(response.body).toHaveProperty('message', 'User not found');
  });

  test('Debería fallar si los pokemonIds son inválidos', async () => {
    const invalidData = {
      pokemonIds: 'not-an-array', // Debe ser array
    };

    const response = await request(app)
      .put(`/users/${testUser.id}/pokemon`)
      .send(invalidData)
      .expect(400);

    expect(response.body).toHaveProperty('message', 'Validation failed');
    expect(response.body).toHaveProperty('errors');
  });
});

describe('DELETE users/:id', () => {
  let testUser;

  beforeEach(async () => {
    await cleanDatabase();
    // Crear un usuario de prueba para actualizar
    testUser = await createTestUser({
      username: 'originaluser',
      email: 'original@example.com',
      password: 'originalPassword123',
      pokemonIds: '[1, 25]',
    });
  });

  test('Debería eliminar un usuario', async () => {
    const response = await request(app)
      .delete(`/users/${testUser.id}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', testUser.id);
    expect(response.body).toHaveProperty('username', 'originaluser');
    expect(response.body).toHaveProperty('email', 'original@example.com');
    expect(response.body).not.toHaveProperty('password');

    // Verificar que el usuario ya no existe
    await request(app).get(`/users/${testUser.id}`).expect(404);
  });

  test('Debería devolver 404 si el usuario no existe', async () => {
    const response = await request(app).delete('/users/999').expect(404);

    expect(response.body).toHaveProperty('message', 'User not found');
  });
});
