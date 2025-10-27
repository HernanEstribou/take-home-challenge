const getAllUsers = () => {
  // Simular una lista de usuarios (en una app real vendría de la DB)
  const response = [
    {
      id: 1,
      username: 'Hernan',
      email: 'hernan@gmail.com',
      password: '1234',
      pokemonIds: [1, 4, 7],
    },
    {
      id: 2,
      username: 'Juan',
      email: 'juan@gmail.com',
      password: '5678',
      pokemonIds: [25, 150],
    },
  ];

  return response;
};

const getOneUser = (id) => {
  const response = id;

  if (id === '1234') {
    console.log('Adentro del if id ===1234');
    const response = {
      id: 1234,
      username: 'Hernan',
      email: 'hernan@gmail.com',
      password: 1234,
      pokemonIds: [2, 5, 7],
    };
    return response;
  }

  return response;
};

const createNewUser = (user) => {
  const response = user;

  return response;
};

const updateOneUser = (id, userData) => {
  const response = `Usuario: ${id} actualizado correctamente con datos ${userData}`;

  return response;
};

const deleteOneUser = (id) => {
  const response = `Usuario: ${id} eliminado correctamente`;

  return response;
};

const updatePokemonIds = (id, pokemonIds) => {
  const response = {
    id: id,
    username: 'Hernan',
    email: 'hernan@gmail.com',
    pokemonIds: pokemonIds,
  };

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
