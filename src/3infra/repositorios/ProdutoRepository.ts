import { Produto } from "../../1entidades/Produto";
import { IProdutoRepositorioInterface } from "../../2domain/interfaces/IProdutoRepositorioInterface";
import { ProdutoModel } from "./Schemas/ProdutoSchema";
import { injectable } from 'inversify';
import 'reflect-metadata';
import mongoose from "mongoose";

interface ProdutoDocument extends mongoose.HydratedDocument<Produto> {}

@injectable()
export class ProdutoRepository implements IProdutoRepositorioInterface {

    /** Converte documento Mongoose para a entidade de domínio */
    private toDomain(doc: ProdutoDocument | null): Produto | null {
        if (!doc) return null;

        return new Produto(
            doc.nome,
            doc.preco,
            doc.estoque,
            doc.descricao,
            doc._id?.toString() || '', // garante que seja string
            doc.id
        );
    }

    /** Busca produto pelo ID customizado */
    async buscarPorId(id: number): Promise<Produto | null> {
        const doc = await ProdutoModel.findOne({ id }).exec();
        return this.toDomain(doc as ProdutoDocument | null);
    }

    /** Busca todos os produtos (com paginação opcional) */
    async buscarTodos(pagina = 1, limite = 10): Promise<Produto[]> {
        const offset = (pagina - 1) * limite;
        const docs = await ProdutoModel.find().skip(offset).limit(limite).exec() as ProdutoDocument[];
        return docs.map(doc => this.toDomain(doc) as Produto);
    }

    /** Cria um novo produto */
    async criar(entidade: Produto): Promise<Produto> {
        // Remove _id vazio para não quebrar o Mongoose
        const { _id, ...dados } = entidade;
        const novoProduto = new ProdutoModel(dados);
        const resultado = await novoProduto.save();
        return this.toDomain(resultado as ProdutoDocument) as Produto;
    }

    /** Atualiza parcialmente um produto */
    async atualizar(id: number, entidade: Partial<Produto>): Promise<Produto | null> {
        delete (entidade as any)._id;
        delete (entidade as any).id;

        const doc = await ProdutoModel.findOneAndUpdate(
            { id },
            { $set: entidade },
            { new: true }
        ).exec();

        return this.toDomain(doc as ProdutoDocument | null);
    }

    /** Substitui completamente um produto (PUT) preservando _id e id */
    async substituir(id: number, dadosCompletos: Produto): Promise<Produto | null> {
        // Busca produto existente
        const existente = await ProdutoModel.findOne({ id }).exec();
        if (!existente) return null;

        // Mantém _id e id originais
        const dadosParaSalvar = {
            ...dadosCompletos,
            _id: existente._id,
            id: existente.id
        };

        const doc = await ProdutoModel.findOneAndReplace(
            { id },
            dadosParaSalvar,
            { new: true }
        ).exec();

        return this.toDomain(doc as ProdutoDocument | null);
    }

    /** Deleta produto pelo ID customizado */
    async deletar(id: number): Promise<boolean> {
        const resultado = await ProdutoModel.deleteOne({ id }).exec();
        return resultado.deletedCount === 1;
    }

    /** Atualiza apenas o estoque do produto */
    async atualizarEstoque(id: number, quantidade: number): Promise<Produto | null> {
        const doc = await ProdutoModel.findOneAndUpdate(
            { id },
            { $inc: { estoque: quantidade } },
            { new: true }
        ).exec();

        return this.toDomain(doc as ProdutoDocument | null);
    }

    /** Busca produtos que ainda têm estoque disponível */
    async buscarProdutosEmEstoque(): Promise<Produto[]> {
        const docs = await ProdutoModel.find({ estoque: { $gt: 0 } }).exec() as ProdutoDocument[];
        return docs.map(doc => this.toDomain(doc) as Produto);
    }
}
