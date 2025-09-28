import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Clientes e Pedidos (Clean Architecture)',
            version: '1.0.0',
            description: 'Documentação da API RESTful para o sistema de E-commerce, seguindo o padrão Clean Architecture e Inversão de Dependência (InversifyJS).',
        },
        servers: [
            {
                url: '/api',
                description: 'Servidor Principal da API',
            },
        ],
        components: {
            securitySchemes: {
                BasicAuth: {
                    type: 'http',
                    scheme: 'basic',
                },
            },
        },
    },
    apis: [
        './src/4webAPI/controllers/*.ts',
        './src/2domain/dtos/*.ts'
    ],
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

export default setupSwagger;
