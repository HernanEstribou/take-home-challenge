import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
          url: 'http://localhost:5173',
          description: 'Local development server',
        },
      ],
    },
  },
  apis: [join(__dirname, './swagger.yml')],
};

const specs = swaggerJsdoc(options);
export default specs;
