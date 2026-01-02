import request from 'supertest';
import app from '../src/app.js';
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from '@jest/globals';
import pokemonClient from '../src/clients/pokemon.client.js';

describe('GET /users', () => {
  test('Debería responder con un código de estado 200', async () => {
    const response = await request(app).get('/users').expect(200);

    expect(Array.isArray(response.body)).toBe(true);

    if (response.body.length > 0) {
      const user = response.body[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).not.toHaveProperty('password');
    }
  });
});

describe('GET /users/:id', () => {
  beforeEach(() => {
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
    const response = await request(app).get('/users/1').expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('pokemons');
    expect(Array.isArray(response.body.pokemons)).toBe(true);

    // Verificar que devuelve los pokemons correctos
    expect(response.body.pokemons.length).toBeGreaterThan(0);

    // Verificar que cada pokemon tiene id y name
    response.body.pokemons.forEach((pokemon) => {
      expect(pokemon).toHaveProperty('id');
      expect(pokemon).toHaveProperty('name');
    });
  });
});
