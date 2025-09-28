import 'reflect-metadata'; 
import { IProdutoRepositorioInterface } from "../../2domain/interfaces/IProdutoRepositorioInterface";
import { CriarProdutoDTO, AtualizarProdutoDTO, ViewProdutoDTO, SubstituirProdutoDTO } from "../../2domain/dtos/ProdutoDTOs"; 
import { Produto } from "../../1entidades/Produto";
import { injectable, inject } from "inversify";
import { TYPES } from "../../config/types"; 
import NotFoundException from "../../2domain/exceptions/NotFoundException";
import ConflictException from "../../2domain/exceptions/ConflictException";
import BadRequestException from "../../2domain/exceptions/BadRequestException";

@injectable()
export class ProdutoService {

    constructor(
        @inject(TYPES.IProdutoRepositorioInterface) private produtoRepositorio: IProdutoRepositorioInterface
    ) {}

    public async criarProduto(dadosProduto: CriarProdutoDTO): Promise<ViewProdutoDTO> {
        const produtosExistentes = await this.produtoRepositorio.buscarTodos();
        const idsExistentes = produtosExistentes.map(produto => produto.id);
        const novoId = idsExistentes.length > 0 ? Math.max(...idsExistentes) + 1 : 1;

        const novoProduto = new Produto(
            dadosProduto.nome,
            dadosProduto.preco,
            dadosProduto.estoque,
            dadosProduto.descricao,
            undefined,
            novoId
        );

        try {
            const produtoPersistido = await this.produtoRepositorio.criar(novoProduto);
            return produtoPersistido as ViewProdutoDTO;
        } catch (error) {
            if (error.message.includes('E11000')) throw new ConflictException('Já existe um produto com este nome.');
            throw error;
        }
    }

    public async buscarProdutoPorId(id: number): Promise<ViewProdutoDTO> {
        const produto = await this.produtoRepositorio.buscarPorId(id);
        if (!produto) throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
        return produto as ViewProdutoDTO;
    }

    public async buscarTodosProdutos(pagina?: number, limite?: number): Promise<ViewProdutoDTO[]> {
        const produtos = await this.produtoRepositorio.buscarTodos(pagina, limite);
        return produtos.map(produto => produto as ViewProdutoDTO);
    }

    public async atualizarProduto(id: number, dadosAtualizados: AtualizarProdutoDTO): Promise<ViewProdutoDTO> {
        const produtoAtualizado = await this.produtoRepositorio.atualizar(id, dadosAtualizados as Partial<Produto>);
        if (!produtoAtualizado) throw new NotFoundException(`Produto com ID ${id} não encontrado para atualização.`);
        return produtoAtualizado as ViewProdutoDTO;
    }

    public async substituirProduto(id: number, dadosCompletos: SubstituirProdutoDTO): Promise<ViewProdutoDTO> {
        const produtoParaSubstituir = new Produto(
            dadosCompletos.nome,
            dadosCompletos.preco,
            dadosCompletos.estoque,
            dadosCompletos.descricao,
            undefined,
            id
        );

        const produtoSubstituido = await this.produtoRepositorio.substituir(id, produtoParaSubstituir);
        if (!produtoSubstituido) throw new NotFoundException(`Produto com ID ${id} não encontrado para substituição.`);
        return produtoSubstituido as ViewProdutoDTO;
    }

    public async deletarProduto(id: number): Promise<boolean> {
        const deletado = await this.produtoRepositorio.deletar(id);
        if (!deletado) throw new NotFoundException(`Produto com ID ${id} não encontrado para deleção.`);
        return true;
    }

    public async alterarEstoque(id: number, quantidade: number): Promise<ViewProdutoDTO> {
        if (quantidade === 0) throw new BadRequestException(['Quantidade deve ser diferente de zero.']);

        if (quantidade < 0) {
            const produtoAtual = await this.produtoRepositorio.buscarPorId(id);
            if (!produtoAtual) throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
            if (produtoAtual.estoque + quantidade < 0) throw new BadRequestException(['Estoque insuficiente.']);
        }

        const produtoAtualizado = await this.produtoRepositorio.atualizarEstoque(id, quantidade);
        if (!produtoAtualizado) throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
        return produtoAtualizado as ViewProdutoDTO;
    }

    public async buscarProdutosEmEstoque(): Promise<ViewProdutoDTO[]> {
        const produtos = await this.produtoRepositorio.buscarProdutosEmEstoque();
        return produtos.map(produto => produto as ViewProdutoDTO);
    }
}
