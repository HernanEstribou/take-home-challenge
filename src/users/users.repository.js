import { prisma } from '../../db.js';
import pokemonClient from '../clients/pokemon.client.js';

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users.map((user) => ({
    ...user,
    pokemonIds: JSON.parse(user.pokemonIds),
  }));
};

const getOneUser = async (id) => {
  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(id),
    },
  });

  if (user) {
    return {
      ...user,
      pokemonIds: JSON.parse(user.pokemonIds),
      pokemons: await pokemonClient.getPokemonById(JSON.parse(user.pokemonIds)),
    };
  }

  return user;
};

const createNewUser = async (user) => {
  const { pokemonIds, ...userData } = user;

  const newUser = await prisma.user.create({
    data: {
      ...userData,
      pokemonIds: JSON.stringify(pokemonIds || []),
    },
  });

  return {
    ...newUser,
    pokemonIds: JSON.parse(newUser.pokemonIds),
  };
};

const updateOneUser = async (userId, userData) => {
  const { pokemonIds, ...restData } = userData;
  const userIdInt = parseInt(userId);

  // Verificar si el usuario existe
  const existingUser = await prisma.user.findUnique({
    where: { id: userIdInt },
  });

  if (!existingUser) {
    return null;
  }

  // Actualizar el usuario
  const modifiedUser = await prisma.user.update({
    where: {
      id: userIdInt,
    },
    data: {
      ...restData,
      ...(pokemonIds && { pokemonIds: JSON.stringify(pokemonIds) }),
    },
  });

  return {
    ...modifiedUser,
    pokemonIds: JSON.parse(modifiedUser.pokemonIds),
  };
};

const deleteOneUser = async (id) => {
  const userIdInt = parseInt(id);

  // Verificar si el usuario existe
  const existingUser = await prisma.user.findUnique({
    where: { id: userIdInt },
  });

  if (!existingUser) {
    return null;
  }

  // Eliminar el usuario
  const deleteUser = await prisma.user.delete({
    where: {
      id: userIdInt,
    },
  });

  return deleteUser;
};

const updatePokemonIds = async (id, pokemonIds) => {
  const userIdInt = parseInt(id);

  // Verificar si el usuario existe
  const existingUser = await prisma.user.findUnique({
    where: { id: userIdInt },
  });

  if (!existingUser) {
    return null;
  }

  // Actualizar los pokemonIds del usuario
  const updatedUser = await prisma.user.update({
    where: {
      id: userIdInt,
    },
    data: {
      pokemonIds: JSON.stringify(pokemonIds || []),
    },
  });

  return {
    ...updatedUser,
    pokemonIds: JSON.parse(updatedUser.pokemonIds),
  };
};

export {
  getAllUsers,
  getOneUser,
  createNewUser,
  updateOneUser,
  deleteOneUser,
  updatePokemonIds,
};
