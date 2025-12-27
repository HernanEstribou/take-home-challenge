import { prisma } from '../../db.js';

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const getOneUser = async (id) => {
  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(id),
    },
    include: {
      pokemonIds: true,
    },
  });

  return user;
};

const createNewUser = async (user) => {
  const { pokemonIds, ...userData } = user;

  const newUser = await prisma.user.create({
    data: {
      ...userData,
      ...(pokemonIds &&
        pokemonIds.length > 0 && {
          pokemonIds: {
            connect: pokemonIds.map((id) => ({ id })),
          },
        }),
    },
    include: {
      pokemonIds: true,
    },
  });

  return newUser;
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

  // Usar una transacción para actualizar el usuario y reasignar pokémons
  const modifiedUser = await prisma.$transaction(async (tx) => {
    // Si hay pokemonIds, primero actualizar el ownerId de esos pokémons
    if (pokemonIds && pokemonIds.length > 0) {
      await tx.pokemon.updateMany({
        where: {
          id: { in: pokemonIds },
        },
        data: {
          ownerId: userIdInt,
        },
      });
    }

    // Actualizar el usuario
    return await tx.user.update({
      where: {
        id: userIdInt,
      },
      data: restData,
      include: {
        pokemonIds: true,
      },
    });
  });

  return modifiedUser;
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

  const deleteUser = await prisma.$transaction(async (tx) => {
    // Primero eliminar todos los pokémons del usuario
    await tx.pokemon.deleteMany({
      where: {
        ownerId: userIdInt,
      },
    });

    // Luego eliminar el usuario
    return await tx.user.delete({
      where: {
        id: userIdInt,
      },
    });
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

  const updatedUser = await prisma.$transaction(async (tx) => {
    // Actualizar el ownerId de los pokémons especificados
    if (pokemonIds && pokemonIds.length > 0) {
      await tx.pokemon.updateMany({
        where: {
          id: { in: pokemonIds },
        },
        data: {
          ownerId: userIdInt,
        },
      });
    }

    // Retornar el usuario con sus pokémons actualizados
    return await tx.user.findUnique({
      where: {
        id: userIdInt,
      },
      include: {
        pokemonIds: true,
      },
    });
  });

  return updatedUser;
};

export {
  getAllUsers,
  getOneUser,
  createNewUser,
  updateOneUser,
  deleteOneUser,
  updatePokemonIds,
};
