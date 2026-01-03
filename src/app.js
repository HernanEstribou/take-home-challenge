import 'dotenv/config';
import express from 'express';
import swaggerUI from 'swagger-ui-express';
import usersRouter from './users/users.controller.js';
import specs from './swagger/swagger.js';

const app = express();
const port = process.env.PORT || 5173;

app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use('/users', usersRouter);

// Solo iniciar servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}

export default app;
