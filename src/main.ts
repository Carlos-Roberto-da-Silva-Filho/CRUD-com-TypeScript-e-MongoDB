import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import MongooseConfig from './3infra/dbConfig/MongooseConfig';
import setupSwagger from './4webAPI/config/Swagger';
import Logger from './3infra/middlewares/Logger';
import { basicAuthMiddleware } from './3infra/middlewares/basicAuthMiddleware';
import ErrorHandler from './3infra/middlewares/ErrorHandler';
import NotFoundException from './2domain/exceptions/NotFoundException';
import routes from './4webAPI/routes';

const app = express();
const port = process.env.PORT ?? 3000;

// Middleware JSON
app.use(express.json());

// Logger
app.use(Logger.init());

// Conexão com MongoDB
(async () => {
  try {
    await MongooseConfig.connect();
    console.log('✅ Conexão com o MongoDB pronta.');

    // Swagger
    setupSwagger(app);

    // Rotas protegidas e principais
    app.use('/api', basicAuthMiddleware, routes);

    // Rota raiz
    app.get('/', (req: Request, res: Response) => {
      res.json('API de Clientes! Acesse /api-docs para a documentação.');
    });

    // Middleware 404
    app.use((req: Request, res: Response, next: NextFunction) => {
      next(new NotFoundException(`Rota não disponível: ${req.method} ${req.path}`));
    });

    // Middleware global de erros
    app.use(ErrorHandler.init());

    // Inicia servidor
    app.listen(port, () => {
      console.info(`🚀 Servidor rodando na porta: http://localhost:${port}`);
      console.info(`📄 Documentação Swagger: http://localhost:${port}/api-docs`);
    });

  } catch (err) {
    console.error('❌ Falha na inicialização da aplicação:', err);
    process.exit(1);
  }
})();
