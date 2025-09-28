import { Router } from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../config/types';

// Controllers
import { ClienteController } from './controllers/ClienteController';
import { EnderecoController } from './controllers/EnderecoController';
import { ProdutoController } from './controllers/ProdutoController';
import { EntregaController } from './controllers/EntregaController';

const routes = Router();

// --- Clientes ---
const clienteController = container.get<ClienteController>(TYPES.ClienteController);
routes.use('/clientes', clienteController.router);

// --- Endereços ---
const enderecoController = container.get<EnderecoController>(TYPES.EnderecoController);
routes.use('/enderecos', enderecoController.router);

// --- Produtos ---
const produtoController = container.get<ProdutoController>(TYPES.ProdutoController);
routes.use('/produtos', produtoController.router);

// --- Entregas ---
const entregaController = container.get<EntregaController>(TYPES.EntregaController);
routes.use('/entregas', entregaController.router);

export default routes;
