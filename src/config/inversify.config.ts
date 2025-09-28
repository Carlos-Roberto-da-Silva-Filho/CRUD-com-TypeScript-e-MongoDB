import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// --- Interfaces ---
import { IClienteRepositorioInterface } from '../2domain/interfaces/IClienteRepositorioInterface';
import { IEnderecoRepositorioInterface } from '../2domain/interfaces/IEnderecoRepositorioInterface';
import { IProdutoRepositorioInterface } from '../2domain/interfaces/IProdutoRepositorioInterface';
import { IEntregaRepositorioInterface } from '../2domain/interfaces/IEntregaRepositorioInterface';

// --- Repositórios ---
import { ClienteRepository } from '../3infra/repositorios/ClienteRepository';
import { EnderecoRepository } from '../3infra/repositorios/EnderecoRepository';
import { ProdutoRepository } from '../3infra/repositorios/ProdutoRepository';
import { EntregaRepository } from '../3infra/repositorios/EntregaRepository';

// --- Services ---
import { ClienteService } from '../2domain/services/ClienteService';
import { EnderecoService } from '../2domain/services/EnderecoService';
import { ProdutoService } from '../2domain/services/ProdutoService';
import { EntregaService } from '../2domain/services/EntregaService';

// --- Controllers ---
import { ClienteController } from '../4webAPI/controllers/ClienteController';
import { EnderecoController } from '../4webAPI/controllers/EnderecoController';
import { ProdutoController } from '../4webAPI/controllers/ProdutoController';
import { EntregaController } from '../4webAPI/controllers/EntregaController';

const container = new Container();

// --- Repositórios ---
container.bind<IClienteRepositorioInterface>(TYPES.IClienteRepositorioInterface).to(ClienteRepository).inSingletonScope();
container.bind<IEnderecoRepositorioInterface>(TYPES.IEnderecoRepositorioInterface).to(EnderecoRepository).inSingletonScope();
container.bind<IProdutoRepositorioInterface>(TYPES.IProdutoRepositorioInterface).to(ProdutoRepository).inSingletonScope();
container.bind<IEntregaRepositorioInterface>(TYPES.IEntregaRepositorioInterface).to(EntregaRepository).inSingletonScope();

// --- Services ---
container.bind<ClienteService>(TYPES.ClienteService).to(ClienteService).inSingletonScope();
container.bind<EnderecoService>(TYPES.EnderecoService).to(EnderecoService).inSingletonScope();
container.bind<ProdutoService>(TYPES.ProdutoService).to(ProdutoService).inSingletonScope();
container.bind<EntregaService>(TYPES.EntregaService).to(EntregaService).inSingletonScope();

// --- Controllers ---
container.bind<ClienteController>(TYPES.ClienteController).to(ClienteController).inSingletonScope();
container.bind<EnderecoController>(TYPES.EnderecoController).to(EnderecoController).inSingletonScope();
container.bind<ProdutoController>(TYPES.ProdutoController).to(ProdutoController).inSingletonScope();
container.bind<EntregaController>(TYPES.EntregaController).to(EntregaController).inSingletonScope();

export { container };

