import 'reflect-metadata';
import { IClienteRepositorioInterface } from "../../2domain/interfaces/IClienteRepositorioInterface";
import { CriarClienteDTO, AtualizarClienteDTO, ViewClienteDTO, SubstituirClienteDTO } from "../../2domain/dtos/ClienteDTOs"; 
import { Cliente } from "../../1entidades/Cliente";
import { injectable, inject } from "inversify";
import { TYPES } from "../../config/types"; 
import NotFoundException from "../../2domain/exceptions/NotFoundException";
import ConflictException from "../../2domain/exceptions/ConflictException";

@injectable()
export class ClienteService {

    constructor(
        @inject(TYPES.IClienteRepositorioInterface) private clienteRepositorio: IClienteRepositorioInterface
    ) {}

    public async criarCliente(dadosCliente: CriarClienteDTO): Promise<ViewClienteDTO> {
        const clientesExistentes = await this.clienteRepositorio.buscarTodos();
        const idsExistentes = clientesExistentes.map(cliente => cliente.id);
        const novoId = idsExistentes.length > 0 ? Math.max(...idsExistentes) + 1 : 1;

        const novoCliente = new Cliente(
            dadosCliente.nome,
            dadosCliente.email,
            dadosCliente.senha,
            dadosCliente.telefone ?? '',
            undefined,
            novoId
        );

        try {
            const clientePersistido = await this.clienteRepositorio.criar(novoCliente);
            return clientePersistido as ViewClienteDTO;
        } catch (error) {
            if (error.message.includes('E11000')) {
                throw new ConflictException('Email já cadastrado.');
            }
            throw error;
        }
    }

    public async buscarClientePorId(id: number): Promise<ViewClienteDTO> {
        const cliente = await this.clienteRepositorio.buscarPorId(id);
        if (!cliente) throw new NotFoundException(`Cliente com ID ${id} não encontrado.`);
        return cliente as ViewClienteDTO;
    }

    public async buscarTodosClientes(): Promise<ViewClienteDTO[]> {
        const clientes = await this.clienteRepositorio.buscarTodos();
        return clientes.map(cliente => cliente as ViewClienteDTO);
    }

    public async atualizarCliente(id: number, dadosAtualizados: AtualizarClienteDTO): Promise<ViewClienteDTO> {
        const clienteAtualizado = await this.clienteRepositorio.atualizar(id, dadosAtualizados as Partial<Cliente>);
        if (!clienteAtualizado) throw new NotFoundException(`Cliente com ID ${id} não encontrado para atualização.`);
        return clienteAtualizado as ViewClienteDTO;
    }

    public async substituirCliente(id: number, dadosCompletos: SubstituirClienteDTO): Promise<ViewClienteDTO> {
        const clienteParaSubstituir = new Cliente(
            dadosCompletos.nome,
            dadosCompletos.email,
            dadosCompletos.senha,
            dadosCompletos.telefone ?? '',
            undefined,
            id
        );

        const clienteSubstituido = await this.clienteRepositorio.substituir(id, clienteParaSubstituir);
        if (!clienteSubstituido) throw new NotFoundException(`Cliente com ID ${id} não encontrado para substituição.`);
        return clienteSubstituido as ViewClienteDTO;
    }

    public async deletarCliente(id: number): Promise<boolean> {
        const deletado = await this.clienteRepositorio.deletar(id);
        if (!deletado) throw new NotFoundException(`Cliente com ID ${id} não encontrado para deleção.`);
        return true;
    }
}
