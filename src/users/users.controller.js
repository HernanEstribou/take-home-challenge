import express from 'express';
import * as usersService from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { UpdatePokemonIdsDto } from './dto/update-pokemonIds.dto.js';
import { UserWithPokemonDto } from './dto/user-with-pokemon.dto.js';

const router = express.Router();

// Ruta: GET /users
router.get('/', (req, res) => {
  const users = usersService.getAllUsers();

  const usersDto = users.map((user) => new UserResponseDto(user));

  res.send(usersDto);
});

// Ruta: GET /users
router.get('/:id', (req, res) => {
  const response = usersService.getOneUser(req.params.id);

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

  const response = usersService.createNewUser(userData);

  res.status(201).json(response);
});

// Ruta: PUT /users
router.put('/:id', (req, res) => {
  const updateUserDto = new UpdateUserDto(req.body);
  const response = usersService.updateOneUser(req.params.id, updateUserDto);
  res.send(response);
});

//Ruta: DELETE /users
router.delete('/:id', (req, res) => {
  const response = usersService.deleteOneUser(req.params.id);
  res.send(response);
});

router.put('/:id/pokemon', (req, res) => {
  const userId = req.params.id;
  const updatePokemonDto = new UpdatePokemonIdsDto(req.body);

  const updateUser = usersService.UpdatePokemonIds(
    userId,
    updatePokemonDto.pokemonIds,
  );
  res.json(updateUser);
});

export default router;
