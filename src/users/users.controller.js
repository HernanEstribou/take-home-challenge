import express from 'express';
import * as usersService from './users.service.js';

const router = express.Router();

// Ruta: GET /users
router.get('/', (req, res) => {
  const response = usersService.getAllUsers();
  res.send(response);
});

// Ruta: GET /users
router.get('/:id', (req, res) => {
  const response = usersService.getOneUser(req.params.id);
  res.send(response);
});

// Ruta: POST /users
router.post('/:user', (req, res) => {
  const response = usersService.createNewUser(req.params.user);
  res.send(response);
});

// Ruta: PATCH /users
router.patch('/:id', (req, res) => {
  const response = usersService.updateOneUser(req.params.id);
  res.send(response);
});

//Ruta: DELETE /users
router.delete('/:id', (req, res) => {
  const response = usersService.deleteOneUser(req.params.id);
  res.send(response);
});

export default router;
