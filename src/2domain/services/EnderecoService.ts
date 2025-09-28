import 'reflect-metadata';
import { IEnderecoRepositorioInterface } from "../../2domain/interfaces/IEnderecoRepositorioInterface";
import { IClienteRepositorioInterface } from '../../2domain/interfaces/IClienteRepositorioInterface';
import { Endereco } from "../../1entidades/Endereco";
import { injectable, inject } from "inversify";
import { TYPES } from "../../config/types"; 
import NotFoundException from "../../2domain/exceptions/NotFoundException";
import ConflictException from "../../2domain/exceptions/ConflictException";
import { CriarEnderecoDTO, AtualizarEnderecoDTO, SubstituirEnderecoDTO, ViewEnderecoDTO } from '../../2domain/dtos/EnderecoDTOs';

@injectable()
export class EnderecoService {

    constructor(
        @inject(TYPES.IEnderecoRepositorioInterface) private enderecoRepositorio: IEnderecoRepositorioInterface,
        @inject(TYPES.IClienteRepositorioInterface) private clienteRepositorio: IClienteRepositorioInterface
    ) {}

    /** Cria um novo endereço */
    public async criarEndereco(dadosEndereco: CriarEnderecoDTO): Promise<ViewEnderecoDTO> {
        const clienteMongoId = dadosEndereco.clienteId;

        // Verifica se o cliente existe usando buscarPorMongoId
        const cliente = await this.clienteRepositorio.buscarPorMongoId(clienteMongoId);
        if (!cliente) throw new NotFoundException(`Cliente com ID Mongo ${clienteMongoId} não encontrado.`);

        // Verifica se cliente já possui endereço
        const enderecoExistente = await this.enderecoRepositorio.buscarPorClienteId(clienteMongoId);
        if (enderecoExistente) throw new ConflictException(`Cliente com ID Mongo ${clienteMongoId} já possui endereço.`);

        // Gera ID incremental
        const enderecosExistentes = await this.enderecoRepositorio.buscarTodos();
        const idsExistentes = enderecosExistentes.map(e => e.id);
        const novoId = idsExistentes.length > 0 ? Math.max(...idsExistentes) + 1 : 1;

        // Cria entidade
        const novoEndereco = new Endereco(
            dadosEndereco.cep,
            dadosEndereco.logradouro,
            dadosEndereco.numero,
            dadosEndereco.bairro,
            dadosEndereco.cidade,
            dadosEndereco.estado,
            clienteMongoId,
            dadosEndereco.complemento,
            undefined,
            novoId
        );

        // Persiste no banco
        const enderecoPersistido = await this.enderecoRepositorio.criar(novoEndereco);

        // Vincula endereço ao cliente
        await this.clienteRepositorio.vincularEndereco(clienteMongoId, enderecoPersistido._id);

        return enderecoPersistido as ViewEnderecoDTO;
    }

    /** Busca todos os endereços */
    public async buscarTodosEnderecos(): Promise<ViewEnderecoDTO[]> {
        const enderecos = await this.enderecoRepositorio.buscarTodos();
        return enderecos as ViewEnderecoDTO[];
    }

    /** Busca endereço por ID customizado */
    public async buscarEnderecoPorId(id: number): Promise<ViewEnderecoDTO> {
        const endereco = await this.enderecoRepositorio.buscarPorId(id);
        if (!endereco) throw new NotFoundException(`Endereço com ID ${id} não encontrado.`);
        return endereco as ViewEnderecoDTO;
    }

    /** Atualiza parcialmente um endereço */
    public async atualizarEndereco(id: number, dadosAtualizados: AtualizarEnderecoDTO): Promise<ViewEnderecoDTO> {
        delete (dadosAtualizados as any).clienteId; // Não permite alterar cliente
        delete (dadosAtualizados as any)._id;

        const enderecoAtualizado = await this.enderecoRepositorio.atualizar(id, dadosAtualizados as Partial<Endereco>);
        if (!enderecoAtualizado) throw new NotFoundException(`Endereço com ID ${id} não encontrado para atualização.`);
        return enderecoAtualizado as ViewEnderecoDTO;
    }

    /** Substitui completamente um endereço */
    public async substituirEndereco(id: number, dados: SubstituirEnderecoDTO): Promise<ViewEnderecoDTO> {
        // Verifica se o cliente existe usando buscarPorMongoId
        const cliente = await this.clienteRepositorio.buscarPorMongoId(dados.clienteId);
        if (!cliente) throw new NotFoundException(`Cliente com ID Mongo ${dados.clienteId} não encontrado.`);

        const endereco = new Endereco(
            dados.cep,
            dados.logradouro,
            dados.numero,
            dados.bairro,
            dados.cidade,
            dados.estado,
            dados.clienteId,
            dados.complemento,
            undefined,
            id
        );

        const enderecoSubstituido = await this.enderecoRepositorio.substituir(id, endereco);
        if (!enderecoSubstituido) throw new NotFoundException(`Endereço com ID ${id} não encontrado para substituição.`);
        return enderecoSubstituido as ViewEnderecoDTO;
    }

    /** Deleta um endereço */
    public async deletarEndereco(id: number): Promise<boolean> {
        const endereco = await this.enderecoRepositorio.buscarPorId(id);
        if (!endereco) throw new NotFoundException(`Endereço com ID ${id} não encontrado para deleção.`);

        const deletado = await this.enderecoRepositorio.deletar(id);
        if (!deletado) throw new NotFoundException(`Endereço com ID ${id} não pôde ser deletado.`);

        await this.clienteRepositorio.desvincularEndereco(endereco.clienteId);
        return true;
    }
}
