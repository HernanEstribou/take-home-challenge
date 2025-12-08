import express from 'express';
import * as usersService from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { UpdatePokemonIdsDto } from './dto/update-pokemonIds.dto.js';
import { UserWithPokemonDto } from './dto/user-with-pokemon.dto.js';

const router = express.Router();

// Ruta: GET /users
router.get('/', async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
    const usersDto = users.map((user) => new UserResponseDto(user));
    res.send(usersDto);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching users', error: error.message });
  }
});

// Ruta: GET /users/:id
router.get('/:id', async (req, res) => {
  const response = await usersService.getOneUser(req.params.id);

  const userDto = new UserWithPokemonDto(response);
  res.send(userDto);
});

// Ruta: POST /users
router.post('/', (req, res) => {
  const createUserDto = new CreateUserDto(req.body);

  const userData = {
    ...createUserDto,
    pokemonIds: createUserDto.pokemonIds || [],
  };

  const validation = createUserDto.validate();

  if (!validation.valid) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validation.errors,
    });
  }

  const response = usersService.createNewUser(userData);

  res.status(201).json(response);
});

// Ruta: PUT /users/:id
router.put('/:id', (req, res) => {
  const updateUserDto = new UpdateUserDto(req.body);

  const validation = updateUserDto.validate();

  if (!validation.valid) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validation.errors,
    });
  }
  const response = usersService.updateOneUser(req.params.id, updateUserDto);
  res.send(response);
});

// Ruta: DELETE /users/:id
router.delete('/:id', (req, res) => {
  const response = usersService.deleteOneUser(req.params.id);
  res.send(response);
});

// Ruta: PUT /users/:id/pokemon
router.put('/:id/pokemon', async (req, res) => {
  const userId = req.params.id;
  const updatePokemonDto = new UpdatePokemonIdsDto(req.body);

  const validation = updatePokemonDto.validate();

  if (!validation.valid) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validation.errors,
    });
  }

  const updateUser = await usersService.updatePokemonIds(
    userId,
    updatePokemonDto.pokemonIds,
  );
  res.json(updateUser);
});

export default router;
