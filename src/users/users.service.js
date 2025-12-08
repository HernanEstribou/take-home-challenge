import * as userRepository from './users.repository.js';

const getAllUsers = async () => {
  const response = await userRepository.getAllUsers();
  return response;
};

const getOneUser = async (id) => {
  const response = await userRepository.getOneUser(id);

  return response;
};

const createNewUser = async (user) => {
  const response = await userRepository.createNewUser(user);

  return response;
};

const updateOneUser = async (id, userData) => {
  const response = await userRepository.updateOneUser(id, userData);

  return response;
};

const deleteOneUser = async (id) => {
  const response = await userRepository.deleteOneUser(id);

  return response;
};

const updatePokemonIds = async (id, pokemonIds) => {
  const response = await userRepository.updatePokemonIds(id, pokemonIds);
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
