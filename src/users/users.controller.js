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
  try {
    const response = await usersService.getOneUser(req.params.id);

    if (!response) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDto = new UserWithPokemonDto(response);
    res.send(userDto);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching user', error: error.message });
  }
});

// Ruta: POST /users
router.post('/', async (req, res) => {
  try {
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

    const response = await usersService.createNewUser(userData);

    res.status(201).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating user', error: error.message });
  }
});

// Ruta: PUT /users/:id
router.put('/:id', async (req, res) => {
  try {
    const updateUserDto = new UpdateUserDto(req.body);

    const validation = updateUserDto.validate();

    if (!validation.valid) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.errors,
      });
    }
    const response = await usersService.updateOneUser(
      req.params.id,
      updateUserDto,
    );

    if (!response) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.send(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating user', error: error.message });
  }
});

// Ruta: DELETE /users/:id
router.delete('/:id', async (req, res) => {
  try {
    const response = await usersService.deleteOneUser(req.params.id);

    if (!response) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.send(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting user', error: error.message });
  }
});

// Ruta: PUT /users/:id/pokemon
router.put('/:id/pokemon', async (req, res) => {
  try {
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

    if (!updateUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updateUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating pokemon IDs', error: error.message });
  }
});

export default router;
