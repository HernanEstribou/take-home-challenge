import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Usuarios',
      version: '1.0.0',
      description: 'API para usuarios',
      contact: {
        name: 'Hernán Estribou',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local server',
        },
      ],
    },
  },
  apis: ['./swagger/*.yml'],
};

const specs = swaggerJsdoc(options);
export default specs;
