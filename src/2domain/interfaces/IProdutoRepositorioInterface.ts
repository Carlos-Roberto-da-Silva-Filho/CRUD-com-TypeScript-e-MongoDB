import { IRepository } from "./IRepository";
import { Produto } from "../../1entidades/Produto";

export interface IProdutoRepositorioInterface extends IRepository<Produto> {
    buscarProdutosEmEstoque(): Promise<Produto[]>;
    atualizarEstoque(id: number, quantidade: number): Promise<Produto | null>;
}
