// src/2domain/services/EntregaService.ts
import 'reflect-metadata';
import { IEntregaRepositorioInterface } from "../../2domain/interfaces/IEntregaRepositorioInterface";
import { IEnderecoRepositorioInterface } from '../../2domain/interfaces/IEnderecoRepositorioInterface';
import { IProdutoRepositorioInterface } from '../../2domain/interfaces/IProdutoRepositorioInterface';
import { Entrega, StatusEntrega } from "../../1entidades/Entrega";
import { CriarEntregaDTO, AtualizarEntregaDTO, ViewEntregaDTO, SubstituirEntregaDTO } from "../../2domain/dtos/EntregaDTOs"; 
import { injectable, inject } from "inversify";
import { TYPES } from "../../config/types"; 
import NotFoundException from "../../2domain/exceptions/NotFoundException";
import BadRequestException from "../../2domain/exceptions/BadRequestException";

@injectable()
export class EntregaService {

    constructor(
        @inject(TYPES.IEntregaRepositorioInterface) private entregaRepositorio: IEntregaRepositorioInterface,
        @inject(TYPES.IEnderecoRepositorioInterface) private enderecoRepositorio: IEnderecoRepositorioInterface,
        @inject(TYPES.IProdutoRepositorioInterface) private produtoRepositorio: IProdutoRepositorioInterface
    ) {}

    /** Cria uma nova entrega */
    public async criarEntrega(dadosEntrega: CriarEntregaDTO): Promise<ViewEntregaDTO> {
        // Gera novo ID incremental
        const entregasExistentes = await this.entregaRepositorio.buscarTodos();
        const idsExistentes = entregasExistentes.map(e => e.id);
        const novoId = idsExistentes.length > 0 ? Math.max(...idsExistentes) + 1 : 1;

        // Valida endereço
        const endereco = await this.enderecoRepositorio.buscarPorId(dadosEntrega.enderecoEntregaId);
        if (!endereco) throw new NotFoundException(`Endereço de entrega com ID ${dadosEntrega.enderecoEntregaId} não encontrado.`);

        // Valida produtos
        for (const produtoId of dadosEntrega.produtosNestaEntregaIds) {
            const produto = await this.produtoRepositorio.buscarPorId(produtoId);
            if (!produto) throw new BadRequestException([`Produto com ID ${produtoId} não encontrado.`]);
        }

        const novaEntrega = new Entrega(
            dadosEntrega.enderecoEntregaId,
            dadosEntrega.dataPrevista,
            dadosEntrega.valorFrete,
            dadosEntrega.produtosNestaEntregaIds,
            undefined,
            novoId
        );

        const entregaPersistida = await this.entregaRepositorio.criar(novaEntrega);
        return entregaPersistida as ViewEntregaDTO;
    }

    /** Busca entrega por ID customizado */
    public async buscarEntregaPorId(id: number): Promise<ViewEntregaDTO> {
        const entrega = await this.entregaRepositorio.buscarPorId(id);
        if (!entrega) throw new NotFoundException(`Entrega com ID ${id} não encontrada.`);
        return entrega as ViewEntregaDTO;
    }

    /** Busca todas as entregas */
    public async buscarTodasEntregas(): Promise<ViewEntregaDTO[]> {
        const entregas = await this.entregaRepositorio.buscarTodos();
        return entregas.map(e => e as ViewEntregaDTO);
    }

    /** Busca entregas por ID de endereço numérico */
    public async buscarPorEndereco(enderecoId: number): Promise<ViewEntregaDTO[]> {
        const entregas = await this.entregaRepositorio.buscarPorEnderecoId(enderecoId.toString());
        return entregas.map(e => e as ViewEntregaDTO);
    }

    /** Atualiza parcialmente a entrega (PATCH) */
    public async atualizarEntrega(id: number, dadosAtualizados: AtualizarEntregaDTO): Promise<ViewEntregaDTO> {
        const entregaAtual = await this.entregaRepositorio.buscarPorId(id);
        if (!entregaAtual) throw new NotFoundException(`Entrega com ID ${id} não encontrada.`);

        if (entregaAtual.status === StatusEntrega.ENTREGUE || entregaAtual.status === StatusEntrega.CANCELADA) {
            throw new BadRequestException([`Não é possível atualizar a entrega ID ${id}, status atual: ${entregaAtual.status}.`]);
        }

        const entregaAtualizada = await this.entregaRepositorio.atualizar(id, dadosAtualizados as Partial<Entrega>);
        return entregaAtualizada as ViewEntregaDTO;
    }

    /** Substitui completamente a entrega (PUT) */
    public async substituirEntrega(id: number, dadosCompletos: SubstituirEntregaDTO): Promise<ViewEntregaDTO> {
        const existente = await this.entregaRepositorio.buscarPorId(id);
        if (!existente) throw new NotFoundException(`Entrega com ID ${id} não encontrada para substituição.`);

        const endereco = await this.enderecoRepositorio.buscarPorId(dadosCompletos.enderecoEntregaId);
        if (!endereco) throw new NotFoundException(`Endereço de entrega com ID ${dadosCompletos.enderecoEntregaId} não encontrado.`);

        for (const produtoId of dadosCompletos.produtosNestaEntregaIds) {
            const produto = await this.produtoRepositorio.buscarPorId(produtoId);
            if (!produto) throw new BadRequestException([`Produto com ID ${produtoId} não encontrado.`]);
        }

        const entregaSubstituida = await this.entregaRepositorio.substituir(id, dadosCompletos as Entrega);
        return entregaSubstituida as ViewEntregaDTO;
    }

    /** Atualiza apenas o status da entrega */
    public async atualizarStatusEntrega(id: number, novoStatus: StatusEntrega): Promise<ViewEntregaDTO> {
        const entregaAtualizada = await this.entregaRepositorio.atualizarStatus(id, novoStatus);
        if (!entregaAtualizada) throw new NotFoundException(`Entrega com ID ${id} não encontrada para atualização de status.`);
        return entregaAtualizada as ViewEntregaDTO;
    }

    /** Deleta uma entrega */
    public async deletarEntrega(id: number): Promise<boolean> {
        const deletado = await this.entregaRepositorio.deletar(id);
        if (!deletado) throw new NotFoundException(`Entrega com ID ${id} não encontrada para deleção.`);
        return true;
    }
}
