import * as userRepository from './users.repository.js';

const getAllUsers = () => {
  const response = userRepository.getAllUsers();

  return response;
};

const getOneUser = (id) => {
  const response = userRepository.getOneUser(id);

  return response;
};

const createNewUser = (user) => {
  const response = userRepository.createNewUser(user);

  return response;
};

const updateOneUser = (id, userData) => {
  const response = userRepository.updateOneUser(id, userData);

  return response;
};

const deleteOneUser = (id) => {
  const response = userRepository.deleteOneUser(id);

  return response;
};

const updatePokemonIds = (id, pokemonIds) => {
  const response = userRepository.updatePokemonIds(id, pokemonIds);
  return response;
};

export {
  getAllUsers,
  getOneUser,
  createNewUser,
  updateOneUser,
  deleteOneUser,
  updatePokemonIds,
};
