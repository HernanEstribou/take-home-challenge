const getAllUsers = () => {
  const response = 'Lista de usuarios';

  return response;
};

const getOneUser = (id) => {
  const response = `Usuario con ID: ${id}`;

  return response;
};

const createNewUser = (user) => {
  const response = `Usuario: ${user} creado exitosamente`;

  return response;
};

const updateOneUser = (id) => {
  const response = `Usuario: ${id} actualizado correctamente`;

  return response;
};

const deleteOneUser = (id) => {
  const response = `Usuario: ${id} eliminado correctamente`;

  return response;
};

export { getAllUsers, getOneUser, createNewUser, updateOneUser, deleteOneUser };
